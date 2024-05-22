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
      <h3>나의 여행일정</h3>
      <ul>
        <li v-for="(review, index) in displayedReviews" :key="index">
          <h4>{{ review.title }}</h4>
          <p>{{ review.content }}</p>
          <ul v-if="review.fileInfos && review.fileInfos.length > 0" class="image-list">
            <li v-for="(file, index) in review.fileInfos" :key="index" class="image-item">
              <img :src="`/file/download/${file.saveFolder}/${file.originalFile}/${file.saveFile}`"
                class="review-image" />
            </li>
          </ul>
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
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { HeaderOne } from "../components";

const userName = "전성권";
const travelPlans = ref(0);
const reviewCount = ref(0);
const savedPlans = ref(0);
const visitedPlaces = ref(0);
const savedLocations = ref(0);
const reviews = ref([]);
const reviewsToShow = ref(5); // 초기에 보여줄 리뷰 개수
const profileImageUrl = ref("");
const nickname = ref("");
const userId = ref(0);

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

    fetchReviews();
  } catch (error) {
    console.error("Failed to fetch user data:", error);
  }
};

const fetchReviews = async () => {
  try {
    const response = await axios.get(
      `/post/user/${userId.value}`
    );
    reviews.value = response.data;
    reviewCount.value = response.data.length;
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
  }
};

const displayedReviews = computed(() =>
  reviews.value.slice(0, reviewsToShow.value)
);
const showMoreButton = computed(
  () => reviews.value.length > reviewsToShow.value
);

const showMoreReviews = () => {
  reviewsToShow.value += 5; // 더보기 버튼 클릭 시 5개 더 보여주기
};

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

.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.image-item {
  width: 100px;
  /* 아이템의 너비를 조절하여 이미지 크기 조절 */
  height: 100px;
  /* 아이템의 높이를 조절하여 이미지 크기 조절 */
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
</style>
