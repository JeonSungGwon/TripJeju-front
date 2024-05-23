<template>

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

</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const travelPlans = ref(0);
const reviewCount = ref(0);
const savedPlans = ref(0);
const visitedPlaces = computed(() => totalListItemCount.value);
const savedLocations = ref(0);



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

const fetchTotalItemCount = async () => {
    try {
        const response = await axios.get(`/visit/user/count/${userId.value}`);
        totalListItemCount.value = response.data;
    } catch (error) {
        console.error("Failed to fetch total item count:", error);
    }
};

</script>

<style></style>