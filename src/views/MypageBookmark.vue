<template>
  <HeaderOne />
  <div class="container">
    <div class="profile-section">
      <div class="profile">
        <img :src="profileImageUrl" alt="Profile Image" />
        <div>
          <h2>{{ nickname }}님의 제주여행</h2>
        </div>
      </div>
    </div>
    <div class="stats-section">
      <div class="stats">
        <div>
          <p>나의 여행일정</p>
          <p>{{ travelPlans}}</p>
        </div>
        <div>
          <p>나의 리뷰</p>
          <p>{{ reviewCount }}</p>
        </div>
        <div>
          <p>방문 여행지</p>
          <p>{{ visitedPlaces}}</p>
        </div>
        <div>
          <p>찜한 여행지</p>
          <p>{{ savedLocations}}</p>
        </div>
        <div>
          <p>찜한 여행일정</p>
          <p>{{ savedPlans}}</p>
        </div>
      </div>
    </div>
    <div class="review-section">
      <h3>찜한 장소</h3>
      <FavoriteMap/>
      <div class="row">
        <div class="col-lg-4 col-md-6 col-sm-12" v-for="spot in displayedSpots" :key="spot.id">
          <div class="card card-custom">
            <div class="card-img">
              <img :src="spot.thumbnailPath" alt="" />
            </div>
            <div class="card-content">
              <div class="card-title">
                <h3>{{ spot.title }}</h3>
              </div>
              <div class="card-subtitle">
                <p>{{ spot.address }}</p>
                <p class="visit">찜한 날짜: {{ formatDate(spot.favoriteDate) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Pagination -->
      <ul class="pagination justify-content-center">
        <li class="page-item" v-if="prev">
          <button @click="changePage(currentPageIndex - 1)" class="page-link" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </button>
        </li>
        <li v-for="index in pageCount" :key="index" class="page-item" :class="{ active: index === currentPageIndex }">
          <button @click="changePage(index)" class="page-link">{{ index }}</button>
        </li>
        <li class="page-item" v-if="next">
          <button @click="changePage(currentPageIndex + 1)" class="page-link" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { HeaderOne } from '../components';
import FavoriteMap from '@/components/FavoriteMap.vue';
import dayjs from 'dayjs';

const spots = ref([]);
const route = useRoute();
const router = useRouter();
const currentPageIndex = ref(parseInt(route.query.no) || 1);
const listRowCount = 6;
const totalListItemCount = ref(0);
const pageCount = computed(() => Math.ceil(totalListItemCount.value / listRowCount));
const prev = computed(() => currentPageIndex.value > 1);
const next = computed(() => currentPageIndex.value < pageCount.value);
const displayedSpots = computed(() => spots.value.slice((currentPageIndex.value - 1) * listRowCount, currentPageIndex.value * listRowCount));
const profileImageUrl = ref('');
const nickname = ref('');
const userId = ref(0);
const map = ref(null);
const markers = ref([]);

// 추가된 속성들
const travelPlans = ref(0);
const reviewCount = ref(0);
const visitedPlaces = ref(0);
const savedLocations = ref(0);
const savedPlans = ref(0);

const fetchUserData = async () => {
  try {
    const response = await axios.get('/users/myInfo', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    });
    const userData = response.data;
    profileImageUrl.value = userData.imageUrl;
    nickname.value = userData.nickname;
    userId.value = userData.id;

    // Fetch travel plans, reviews, visited places, saved locations, and saved plans
    fetchFavoriteSpots();
    fetchTravelPlans();
    fetchReviews();
    fetchTotalItemCount();
    fetchsavedLocations();
  } catch (error) {
    console.error('Failed to fetch user data:', error);
  }
};

// 방문 여행지
const fetchTotalItemCount = async () => {
    try {
        const response = await axios.get(`/visit/user/count/${userId.value}`);
        visitedPlaces.value = response.data;
    } catch (error) {
        console.error("Failed to fetch total item count:", error);
    }
};


//reviewCount
const fetchReviews = async () => {
    try {
        const response = await axios.get(`/post/user/${userId.value}`);
        reviewCount.value = response.data.length;
    } catch (error) {
        console.error('Failed to fetch reviews:', error);
    }
};

// savedLocations
const fetchsavedLocations = async () => {
  try {
    const response = await axios.get(`/favorite/user/count/${userId.value}`)
    console.log(response.da)
    savedLocations.value = response.data;
  } catch (error) {
    console.error("Failed to fetch travel plans:", error);
  }
};

// travelPlans
const fetchTravelPlans = async () => {
  try {
    const response = await axios.get(`/travel-route/user/count/${userId.value}`)
    console.log(response.da)
    travelPlans.value = response.data;
  } catch (error) {
    console.error("Failed to fetch travel plans:", error);
  }
};

const fetchFavoriteSpots = async () => {
  try {
    const response = await axios.get(`/favorite/user/${userId.value}`);
    const favoriteSpots = response.data;

    const spotDetailsPromises = favoriteSpots.map(async (favorite) => {
      const spotResponse = await axios.get(`/spots/id/${favorite.placeId}`);
      console.log(favorite.createdAt)
      return { ...spotResponse.data, favoriteDate: dayjs(favorite.createdAt).format('YYYY-MM-DD') };
    });

    spots.value = await Promise.all(spotDetailsPromises);
    totalListItemCount.value = spots.value.length;
    initMap();
  } catch (error) {
    console.error("Failed to fetch favorite spots:", error);
  }
};

const initMap = () => {
  map.value = new naver.maps.Map('mapContainer', {
    center: new naver.maps.LatLng(33.3617, 126.5292),
    zoom: 10
  });

  updateMarkers();
};

const updateMarkers = () => {
  markers.value.forEach(marker => marker.setMap(null)); // 기존 마커 제거
  markers.value = displayedSpots.value.map(spot => {
    const marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(spot.latitude, spot.longitude),
      map: map.value,
            icon: {
              url: `./assets/img/favoriteMarker.png`,
              size: new naver.maps.Size(30, 30),
              scaledSize: new naver.maps.Size(30, 30),
            },
    });

    const infowindow = new naver.maps.InfoWindow({
      content: `<div style="width:200px;text-align:center;padding:10px;">${spot.title}</div>`
    });

    naver.maps.Event.addListener(marker, 'click', () => {
      infowindow.open(map.value, marker);
    });

    return marker;
  });
  
};
const formatDate = (dateString) => {
  return dayjs(dateString).format('YYYY년 MM월 DD일');
};

const changePage = (pageIndex) => {
  currentPageIndex.value = pageIndex;
  updateMarkers();
};


watch(() => route.query.no, (newNo) => {
  currentPageIndex.value = parseInt(newNo) || 1;
  updateMarkers();
});

onMounted(() => {
  fetchUserData();
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  background-color: #f7f7f7;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
}

.profile-section, .stats-section, .review-section, .new-section {
  width: 100%;
  margin-bottom: 30px;
}

.profile, .stats {
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-bottom: 1px solid #ddd;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.profile img {
  border-radius: 50%;
  width: 100px;
  height: 100px;
  background-color: #f0f0f0;
}

.review-section ul {
  list-style-type: none;
  padding: 0;
}

.card-custom {
  width: 100%;
  height: 100%;
}

.card {
  background-color: #fff;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-img img {
  width: 100%;
  height: auto;
  object-fit: cover;
  height: 200px;
}

.card-content {
  padding: 22px;
  display: flex;
  flex-direction: column;
  text-align: center;
  font-size: 18px;
  flex-grow: 1;
  height: 120px;
  overflow: hidden;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-subtitle {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

a {
  font-size: 18px;
  text-decoration: none;
  color: #333;
}

a:hover {
  color: #555;
}

.social-links {
  list-style-type: none;
  padding: 0;
  display: flex;
  gap: 10px;
}

.social-links li {
  color: #333;
  font-size: 20px;
}

.social-links li a {
  color: inherit;
}

.social-links li a:hover {
  color: #555;
}

h3 {
  color: #333;
  font-size: 24px;
  margin-bottom: 10px;
}

p {
  color: #666;
  font-size: 16px;
}

.visit {
  color: rgb(56, 163, 56);
  font-size: 13px;
}

.pagination {
  margin-top: 20px;
}

.page-item button {
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 5px 10px;
  cursor: pointer;
}

.page-item button:hover {
  background-color: #f0f0f0;
}

.page-item.active button {
  background-color: #ddd;
}

@media (min-width: 992px) {
  .col-lg-4 {
    flex: 0 0 auto;
    width: 33.33333333%;
    margin-bottom: 27px;
  }
}

#mapContainer {
  width: 100%;
  height: 400px;
  margin-bottom: 20px;
}
</style>
