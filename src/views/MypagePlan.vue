<template>
  <HeaderOne/>
  <div class="container">
    <div class="profile-section">
      <div class="profile">
        <img src="" alt="Profile Image">
        <div>
          <h2>{{ userName }}님의 제주여행</h2>
          <p>성산일출봉</p>
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
          <p>{{ favoritePlaces }}</p>
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
      <ul>
        <li v-for="(review, index) in displayedReviews" :key="index">
          <h4>{{ review.title }}</h4>
          <p>{{ review.content }}</p>
        </li>
      </ul>
      <button v-if="showMoreButton" @click="showMoreReviews">더보기</button>
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
const favoritePlaces = ref(0);
const savedPlans = ref(0);
const visitedPlaces = ref(0);
const savedLocations = ref(6);
const reviews = ref([]);
const reviewsToShow = ref(5);  // 초기에 보여줄 리뷰 개수

const fetchReviews = async () => {
  try {
    const response = await axios.get('http://localhost:8080/post/user/1');
    reviews.value = response.data;
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
  }
};

const displayedReviews = computed(() => reviews.value.slice(0, reviewsToShow.value));
const showMoreButton = computed(() => reviews.value.length > reviewsToShow.value);

const showMoreReviews = () => {
  reviewsToShow.value += 5;  // 더보기 버튼 클릭 시 5개 더 보여주기
};

onMounted(() => {
  fetchReviews();
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

.review-section button {
  display: block;
  margin: 0 auto;
  padding: 10px 20px;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.review-section button:hover {
  background-color: #555;
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
</style>
