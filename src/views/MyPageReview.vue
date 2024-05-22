<template>
  <HeaderOne/>
  <div class="container">
    <div class="profile-section">
      <div class="profile">
        <img :src="profileImageUrl" alt="Profile Image">
        <div>
          <h2>{{ nickname }}님의 제주여행</h2>
        </div>
      </div>
    </div>
    <div class="stats-section">
      <div class="stats">
        <div>
          <p>나의 여행일정</p>
          <p>{{ travelPlans }}</p>
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
      <h3>나의 리뷰</h3>
      <ul>
        <li v-for="(review, index) in displayedReviews" :key="index" class="review-item">
          <h4>{{ review.title }}</h4>
          <p>{{ review.content }}</p>
          <ul v-if="review.fileInfos && review.fileInfos.length > 0" class="image-list">
              <li v-for="(file, index) in review.fileInfos" :key="index" class="image-item">
                <img :src="`http://localhost:8080/file/download/${file.saveFolder}/${file.originalFile}/${file.saveFile}`" class="review-image" />
              </li>
          </ul>
          <!-- 삭제 버튼 -->
          <button v-if="review.userId === userId" @click="deleteReview(review.id)" class="delete-button">삭제</button>
        </li>
      </ul>
      <div class="center">
        <!-- 더보기 버튼 -->
        <button v-if="showMoreButton" @click="showMoreReviews">더보기</button>
      </div>
    </div>
    <div class="new-section">
      <h3>새로운 섹션</h3>
      <p>이 섹션은 새로운 기능이나 정보를 제공합니다.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { HeaderOne } from '../components';

const userName = '전성권';
const travelPlans = ref(0);
const reviewCount = ref(0);
const savedPlans = ref(0);
const visitedPlaces = computed(() => totalListItemCount.value);
const savedLocations = ref(0);
const reviews = ref([]);
const reviewsToShow = ref(5);  // 초기에 보여줄 리뷰 개수
const profileImageUrl = ref('');
const nickname = ref(''); 
const userId = ref(0);
const totalListItemCount = ref(0);

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
    
    fetchReviews();
  } catch (error) {
    console.error('Failed to fetch user data:', error);
  }
};

const fetchTotalItemCount = async () => {
    try {
      const response = await axios.get("/visit/user/count/1");
      totalListItemCount.value = response.data;
    } catch (error) {
      console.error("Failed to fetch total item count:", error);
    }
  };

const fetchReviews = async () => {
  try {
      const response = await axios.get(`/post/user/${userId.value}`);
      reviews.value = response.data;
      reviewCount.value =  response.data.length;
  } catch (error) {
      console.error('Failed to fetch reviews:', error);
  }
};

const displayedReviews = computed(() => reviews.value.slice(0, reviewsToShow.value));
const showMoreButton = computed(() => reviews.value.length > reviewsToShow.value);

const showMoreReviews = () => {
  reviewsToShow.value += 5;  // 더보기 버튼 클릭 시 5개 더 보여주기
};

const deleteReview = async (reviewId) => {
  try {
    await axios.delete(`/post/${reviewId}`);
    reviews.value = reviews.value.filter(review => review.id !== reviewId);
    reviewCount.value -= 1;
  } catch (error) {
    console.error('리뷰 삭제 중 오류가 발생했습니다.', error);
  }
};

onMounted(() => {
  fetchUserData();
  fetchTotalItemCount();
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

.review-section li {
  position: relative; /* 부모 요소를 상대 위치로 설정 */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.review-section li h4 {
  color: #333;
  font-size: 20px;
  margin-bottom: 10px;
}

.review-section li p {
  color: #666;
  font-size: 16px;
}

.review-section .delete-button {
  position: absolute; /* 삭제 버튼의 위치를 절대로 설정 */
  top: 10px; /* 원하는 위치로 조절 (위치 조절 값은 상황에 따라 변경 가능) */
  right: 10px; /* 원하는 위치로 조절 (위치 조절 값은 상황에 따라 변경 가능) */
  background-color: #ff5a5f;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
}

.review-section .delete-button:hover {
  background-color: #ff3b3f;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.image-item {
  width: 100px; /* 아이템의 너비를 조절하여 이미지 크기 조절 */
  height: 100px; /* 아이템의 높이를 조절하여 이미지 크기 조절 */
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-item img:hover {
  transform: scale(1.05);
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
.center {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.center button {
  background-color: gray; /* 파란색 */
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
}
</style>
