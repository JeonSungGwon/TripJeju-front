<template>
  <HeaderOne />
  <BreadCrumb />
  <div class="team-area gray-bg section-padding">
    <div class="container">
      <div class="search-container">
        <h2 class="section-title">여행지 일정</h2>
        
      </div>
      <div class="row">
        <div class="col-lg-3 col-md-6 mb-4" v-for="route in filteredRoutes" :key="route.id">
          <div class="single-team-member" @click="openModal(route.id)">
            <div class="team-member-img" style="margin-bottom: -24px">
              <img
                :src="route.img"
                alt="Route Thumbnail"
              />
            </div>
            <div class="team-content">
              <div class="team-title">
                <span class="team-link">{{ route.routeName }}</span>
              </div>
              <div class="team-subtitle">
                <p>{{ formatDate(route.startAt) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <RoutePageLink :searchTerm="searchTerm" />
      <div
        v-if="selectedRouteId"
        class="modal-overlay" @click.self="closeModal"
      >
      <div class="modal-content modal-custom">
    <div class="modal-header">
      <h3>경로 상세 정보</h3>
      <button class="close-button" @click="closeModal">&times;</button>
    </div>
    <div class="modal-body">
      <RouteDetail :route-id="selectedRouteId" @close="closeModal" />
    </div>
  </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
import { BreadCrumb, HeaderOne } from "../components";
import RoutePageLink from "@/components/RoutePageLink.vue";
import RouteDetail from "@/components/RouteDetail.vue";

const pageLimit = 12;
const routes = ref([]);
const route = useRoute();
const searchTerm = ref("");
const selectedRouteId = ref(null);

// fetchRoutes 함수 내부에서 받아온 데이터를 startAt을 기준으로 정렬합니다.
const fetchRoutes = async () => {
  const page = route.query.no ? parseInt(route.query.no) : 0;
  try {
    const { data: fetchedRoutes } = await axios.get(
      `http://localhost:8080/travel-route`,
      {
        params: { size: pageLimit, page },
      }
    );
    const sortedRoutes = fetchedRoutes.sort((a, b) => new Date(b.startAt) - new Date(a.startAt));
    routes.value = sortedRoutes;
    console.log("Fetched and sorted Routes:", sortedRoutes); // 정렬된 데이터 확인을 위해 콘솔에 로그 출력
  } catch (error) {
    console.error("Error fetching routes:", error);
  }
};

const openModal = (id) => {
  selectedRouteId.value = id;
};

const closeModal = () => {
  selectedRouteId.value = null;
};

onMounted(fetchRoutes);

watch(() => route.query.no, fetchRoutes);
watch(searchTerm, fetchRoutes);

const filteredRoutes = computed(() => {
  return routes.value.filter((route) => {
    return route.routeName
      .toLowerCase()
      .includes(searchTerm.value.toLowerCase());
  });
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};
</script>

<style scoped>
.search-input {
  color: black;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
}

.search-container {
  text-align: center;
  margin-bottom: 30px;
}

.section-title {
  margin-bottom: 15px;
  font-size: 24px;
}

.single-team-member {
  display: flex; /* Flex 컨테이너로 설정 */
  align-items: center; /* 수직 가운데 정렬 */
  border: 1px solid #ddd;
  border-radius: 5px;
  overflow: hidden;
  transition: transform 0.3s ease-in-out;
  margin-bottom: 20px;
}

.single-team-member:hover {
  transform: translateY(-5px);
}

.team-content {
  padding: 15px;
  text-align: center;
}

.team-title {
  font-size: 20px;
  margin-bottom: 40px;
}

.team-subtitle {
  font-size: 16px;
}

.team-link {
  text-decoration: none;
  color: #333;
  transition: color 0.3s ease-in-out;
}

.team-link:hover {
  color: #007bff;
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
  overflow-y: auto; /* 모달 창이 화면에 넘칠 경우 스크롤 가능하게 */
}

.modal-content {
  background: white;
  border-radius: 10px;
  width: 100%; /* 너비 줄임 */
  max-width: 940px; /* 최대 너비 설정 */
  padding: 20px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
  max-height: 80%; /* 높이 줄임 */
  overflow-y: auto; /* 내용물이 넘칠 경우 스크롤 가능하게 */
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
.modal-content.modal-custom {
  background-color: #ffffff; /* 모달 내부 배경색 조정 */
  border-radius: 20px; /* 모달 테두리를 더 부드럽게 만듭니다. */
  padding: 30px; /* 내부 여백을 더 넓게 조정합니다. */
}

.close-button {
  background: #333; /* 닫기 버튼 배경색 조정 */
  color: #fff; /* 닫기 버튼 텍스트 색상을 흰색으로 변경 */
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 5px 10px; /* 버튼 내부 여백을 추가하여 더 명확하게 표시 */
  border-radius: 20%; /* 닫기 버튼을 원형으로 만듭니다. */
  transition: background-color 0.3s; /* 호버 효과를 부드럽게 적용합니다. */
}

.close-button:hover {
  background: #555; /* 호버 시 배경색 변경 */
}

/* 아래는 모달창이 화면보다 클 경우 스크롤이 생기도록 조정합니다. */
@media (max-width: 600px) {
  .modal-content {
    width: 90%;
    max-width: 90%;
  }
}
</style>