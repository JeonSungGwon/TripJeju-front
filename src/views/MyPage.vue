<template>
    <HeaderOne />
    <BreadCrumb />
    <div class="my-page">
      <!-- 프로필 정보와 여행 정보 -->
      <div class="profile-travel-info">
        <!-- 프로필 정보 -->
        <div class="profile">
          <img class="profile-image" :src="profileImage" alt="Profile Image">
          <h2 class="profile-name">{{ userName }}님의 여행정보</h2>
        </div>
  
        <!-- 여행 정보 -->
        <div class="travel-info">
          <div class="info-item">
            <i class="fas fa-plane-departure"></i>
            <div class="info">
              <h3>나의 여행일정</h3>
              <p>{{ myTravelPlans }}</p>
            </div>
          </div>
          <div class="info-item">
            <i class="fas fa-heart"></i>
            <div class="info">
              <h3>찜한 여행일정</h3>
              <p>{{ likedTravelPlans }}</p>
            </div>
          </div>
          <div class="info-item">
            <i class="fas fa-star"></i>
            <div class="info">
              <h3>찜한 즐겨찾기</h3>
              <p>{{ favoritePlaces }}</p>
            </div>
          </div>
          <div class="info-item">
            <i class="fas fa-map-marked-alt"></i>
            <div class="info">
              <h3>방문 여행지</h3>
              <p>{{ visitedPlaces }}</p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- 리뷰 리스트 -->
      <div class="review-list">
        <h2>나의 리뷰</h2>
        <ul>
          <li v-for="review in userReviews" :key="review.id">
            <h3>{{ review.title }}</h3>
            <p>{{ review.content }}</p>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import HeaderOne from "@/components/header/HeaderOne.vue";
  import BreadCrumb from "@/components/BreadCrumb.vue";
  
  const profileImage = ref('path_to_profile_image.jpg');
  const userName = ref('사용자명');
  const myTravelPlans = ref(10);
  const likedTravelPlans = ref(5);
  const favoritePlaces = ref(3);
  const visitedPlaces = ref(7);
  const userReviews = ref([
    { id: 1, title: '리뷰 제목 1', content: '리뷰 내용 1' },
    { id: 2, title: '리뷰 제목 2', content: '리뷰 내용 2' },
    // 실제 리뷰 데이터는 이곳에 추가합니다.
  ]);
  </script>
  
  <style scoped>
  .my-page {
    margin: 0 auto;
    padding: 20px;
  }
  
  .profile-travel-info {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  
  .profile {
    text-align: center;
  }
  
  .profile-image {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-bottom: 10px;
  }
  
  .profile-name {
    font-size: 24px;
    color: #333; /* Dark gray text color */
  }
  
  .travel-info {
    background-color: #f0f5ff; /* 연한 파란색 배경 */
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
  }
  
  .info-item {
    width: 45%; /* Adjusted width */
    padding: 10px;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    background-color: #f9f9f9; /* Light gray background */
    border-radius: 10px;
  }
  
  .info-item i {
    margin-right: 10px;
    font-size: 20px; /* Reduced icon size */
    color: #6c5ce7; /* Purple icon color */
  }
  
  .info {
    flex-grow: 1;
  }
  
  .review-list {
    background-color: #fff3e6; /* 연한 주황색 배경 */
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
  }
  
  .review-list h2 {
    font-size: 24px;
    margin-bottom: 20px;
    color: #333; /* Dark gray text color */
  }
  
  .review-list ul {
    list-style: none;
    padding: 0;
  }
  
  .review-list li {
    background-color: #f9f9f9; /* Light gray background */
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Shadow effect */
  }
  
  .review-list h3 {
    color: #6c5ce7; /* Purple title color */
  }
  </style>
  