    <template>
        <div>
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
                    <h3>방문 여행지</h3>
                    <div class="row">
                        <div class="col-lg-4 col-md-6 col-sm-12" v-for="tm in team" :key="tm.id">
                            <div class="card card-custom">
                                <div class="card-img">
                                    <img :src="tm.thumbnailPath" alt="" />
                                </div>
                                <div class="card-content">
                                    <div class="card-title">
                                        <router-link :to="`/reviewBoard?id=${tm.id}`">{{ tm.title }}</router-link>
                                    </div>
                                    <div class="card-subtitle">
                                        <p>{{ tm.sub_title }}</p>
                                        <p class="visit">방문 날짜: {{ tm.visitDate }}</p>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <ul class="pagination justify-content-center">
                        <li class="page-item" v-if="prev">
                            <router-link :to="`/myPageVisited?no=${currentPageIndex - 1}`" class="page-link"
                                aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                            </router-link>
                        </li>

                        <li v-for="index in pageCount" :key="index" class="page-item"
                            :class="{ active: index === currentPageIndex }">
                            <router-link :to="`/myPageVisited?no=${index}`" class="page-link">
                                {{ index }}
                            </router-link>
                        </li>

                        <li class="page-item" v-if="next">
                            <router-link :to="`/myPageVisited?no=${currentPageIndex + 1}`" class="page-link"
                                aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                            </router-link>
                        </li>
                    </ul>
                </div>
                <div class="new-section">
                    <h3>새로운 섹션</h3>
                    <p>이 섹션은 새로운 기능이나 정보를 제공합니다.</p>
                </div>
            </div>
        </div>
    </template>

<script setup>
import axios from 'axios';
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { HeaderOne } from "../components";

const team = ref([]);
const route = useRoute();
const router = useRouter();
const travelPlans = ref(0);
const reviewCount = ref(0);
const savedPlans = ref(0);
const visitedPlaces = computed(() => totalListItemCount.value);
const savedLocations = ref(0);
// Pagination variables
const listRowCount = 6;
const currentPageIndex = ref(parseInt(route.query.no) || 1);
const totalListItemCount = ref(0);
const pageCount = computed(() => Math.ceil(totalListItemCount.value / listRowCount));
const startPageIndex = computed(() => (currentPageIndex.value - 1) * listRowCount + 1);
const endPageIndex = computed(() => Math.min(startPageIndex.value + listRowCount - 1, totalListItemCount.value));
const prev = computed(() => currentPageIndex.value > 1);
const next = computed(() => endPageIndex.value < totalListItemCount.value);
const profileImageUrl = ref('');
const nickname = ref('');
const userId = ref(0);

const fetchUserData = async () => {
    try {
        const response = await axios.get('/users/myInfo', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        });
        console.log(response)
        const userData = response.data;
        profileImageUrl.value = userData.imageUrl;
        nickname.value = userData.nickname;
        userId.value = userData.id;

        fetchReviews();
        fetchSpots();
        fetchTotalItemCount();
    } catch (error) {
        console.error('Failed to fetch user data:', error);
    }
};

const fetchReviews = async () => {
    try {
        const response = await axios.get(`/post/user/${userId.value}`);
        reviewCount.value = response.data.length;
    } catch (error) {
        console.error('Failed to fetch reviews:', error);
    }
};

const fetchSpots = async () => {
    try {
        const response = await axios.get(`/visit/user/${userId.value}`, {
            params: { size: listRowCount, page: currentPageIndex.value - 1 }
        });
        // 받아온 데이터를 visitDate를 기준으로 내림차순 정렬
        team.value = response.data.sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));
        console.log(team.value);
    } catch (error) {
        console.error("Failed to fetch spots:", error);
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

watch(() => route.query.no, (newNo) => {
    currentPageIndex.value = parseInt(newNo) || 1;
    fetchSpots();
});

onMounted(() => {
    fetchUserData();
});
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
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
    height: 100%; /* 카드 높이 조절 */
}

.card {
    background-color: #fff;
    border-radius: 10px;
    margin-bottom: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%; /* 카드 높이 조절 */
}

.card-img img {
    width: 100%;
    height: auto; /* 이미지가 자동으로 비율 유지하도록 설정 */
    object-fit: cover;
    height: 200px; 
}

.card-content {
    padding: 22px; /* 내용 영역 패딩 조정 */
    display: flex;
    flex-direction: column;
    text-align: center;
    font-size: 18px; /* 폰트 사이즈 축소 */
    flex-grow: 1;
    height: 120px; /* 내용 영역 높이 조절 */
    overflow: hidden; /* 초과 내용 숨김 처리 */
}

.card-title {
    font-size: 16px; /* 제목 폰트 사이즈 축소 */
    font-weight: bold;
    margin-bottom: 5px; /* 제목과 부제목 간격 조정 */
    overflow: hidden;
    text-overflow: ellipsis; /* 제목이 너무 길 경우 생략 (...) 처리 */
    white-space: nowrap; /* 텍스트가 줄바꿈되지 않도록 설정 */
}

.card-subtitle {
    overflow: hidden;
    text-overflow: ellipsis; /* 부제목이 너무 길 경우 생략 (...) 처리 */
    white-space: nowrap; /* 텍스트가 줄바꿈되지 않도록 설정 */
}


a {
    font-size: 18px;
    text-decoration: none; /* 링크 밑줄 제거 */
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
.visit{
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
</style>