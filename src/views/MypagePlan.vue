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
          <p>{{ travelPlans.length }}</p>
        </div>
        <div>
          <p>나의 리뷰</p>
          <p>{{ reviewCount }}</p>
        </div>
        <div>
          <p>방문 여행지</p>
          <p>{{ visitedPlaces }}</p>
        </div>
        <div>
          <p>찜한 여행지</p>
          <p>{{ savedLocations }}</p>
        </div>
        <div>
          <p>찜한 여행일정</p>
          <p>{{ savedPlans }}</p>
        </div>
      </div>
    </div>
    <div class="review-section">
      <h3>나의 여행일정</h3>
      <div class="row">
        <!-- 새로 생성하기 카드 -->
        <div class="col-lg-4 col-md-6 col-sm-12">
          <div class="card card-custom create-card" @click="openCreateRouteModal">
            <div class="card-img">
              <img class="plus" src="/assets/img/plus.png" height=30px alt="" />
            </div>
            <div class="card-content">
              <div class="card-title">
                <p>새로운 경로 생성하기</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 기존 여행 일정 카드 -->
        <div
          class="col-lg-4 col-md-6 col-sm-12"
          v-for="tm in travelPlans"
          :key="tm.id"
        >
          <div class="card card-custom" @click="openRouteDetailModal(tm.id)">
            <div class="card-img">
              <img :src="tm.img" alt="" />
            </div>
            <div class="card-content">
              <div class="card-title">
                <h3>{{ tm.routeName }}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <ul class="pagination justify-content-center">
        <li class="page-item" v-if="prev">
          <router-link
            :to="`/myPagePlan?no=${currentPageIndex - 1}`"
            class="page-link"
            aria-label="Previous"
          >
            <span aria-hidden="true">&laquo;</span>
          </router-link>
        </li>

        <li
          v-for="index in pageCount"
          :key="index"
          class="page-item"
          :class="{ active: index === currentPageIndex }"
        >
          <router-link :to="`/myPagePlan?no=${index}`" class="page-link">
            {{ index }}
          </router-link>
        </li>

        <li class="page-item" v-if="next">
          <router-link
            :to="`/myPagePlan?no=${currentPageIndex + 1}`"
            class="page-link"
            aria-label="Next"
          >
            <span aria-hidden="true">&raquo;</span>
          </router-link>
        </li>
      </ul>
    </div>

    <!-- Create Route Modal -->
    <div v-if="showCreateRouteModal" class="modal-overlay" @click.self="closeCreateRouteModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>새로운 경로 생성하기</h3>
          <button class="close-button" @click="closeCreateRouteModal">&times;</button>
        </div>
        <div class="modal-body">
          <Route @close="closeCreateRouteModal" />
        </div>
      </div>
    </div>

    <!-- Route Detail Modal -->
    <div v-if="showRouteDetailModal" class="modal-overlay" @click.self="closeRouteDetailModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>경로 상세 정보</h3>
          <button class="close-button" @click="closeRouteDetailModal">&times;</button>
        </div>
        <div class="modal-body">
          <RouteDetail :route-id="selectedRouteId" @close="closeRouteDetailModal" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { HeaderOne } from "../components";
import Route from "@/views/Route.vue";
import RouteDetail from "@/components/RouteDetail.vue";

const userName = ref("");
const travelPlans = ref([]);
const reviewCount = ref(0);
const savedPlans = ref(0);
const visitedPlaces = ref(0);
const savedLocations = ref(0);
const profileImageUrl = ref("");
const nickname = ref("");
const userId = ref(0);
const showCreateRouteModal = ref(false);
const showRouteDetailModal = ref(false);
const selectedRouteId = ref(null);
const currentPageIndex = ref(1); // pagination 관련 변수
const listRowCount = 6; // 한 페이지당 보여줄 항목 수
const totalListItemCount = ref(0);

const fetchUserData = async () => {
  try {
    const response = await axios.get("/users/myInfo", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    console.log(response);
    const userData = response.data;
    profileImageUrl.value = userData.imageUrl;
    nickname.value = userData.nickname;
    userId.value = userData.id;

    fetchTravelPlans();
    fetchReviews();
  } catch (error) {
    console.error("Failed to fetch user data:", error);
  }
};

const fetchTravelPlans = async () => {
  try {
    const response = await axios.get(`/travel-route/user/${userId.value}`, {
      params: { size: listRowCount, page: currentPageIndex.value - 1 }
    });
    travelPlans.value = response.data.sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));
    totalListItemCount.value = response.headers['x-total-count']; // 서버에서 총 항목 수를 헤더에 담아 보낸다고 가정
  } catch (error) {
    console.error("Failed to fetch travel plans:", error);
  }
};

const fetchReviews = async () => {
  try {
    const response = await axios.get(`/post/user/${userId.value}`);
    reviewCount.value = response.data.length;
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
  }
};

const openCreateRouteModal = () => {
  showCreateRouteModal.value = true;
};

const closeCreateRouteModal = () => {
  showCreateRouteModal.value = false;
};

const openRouteDetailModal = (routeId) => {
  selectedRouteId.value = routeId;
  showRouteDetailModal.value = true;
};

const closeRouteDetailModal = () => {
  showRouteDetailModal.value = false;
};

// Pagination 관련 메서드
const prev = computed(() => currentPageIndex.value > 1);
const next = computed(() => currentPageIndex.value < Math.ceil(totalListItemCount.value / listRowCount));

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

.profile-section,
.stats-section,
.review-section,
.new-section {
  width: 100%;
  margin-bottom: 30px;
}

.profile,
.stats {
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
  margin-right: 20px;
}

.stats {
  display: flex;
  justify-content: space-around;
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
  height: 60px;
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

@media (min-width: 992px) {
  .col-lg-4 {
    flex: 0 0 auto;
    width: 33.33333333%;
    margin-bottom: 27px;
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 10px;
  width: 80%;
  padding: 20px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.modal-body {
  margin-top: 20px;
}
</style>
