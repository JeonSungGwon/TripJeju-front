<template>
  <HeaderOne />
  <BreadCrumb />
  <div class="team-area gray-bg section-padding">
    <div class="container">
      <div class="search-container">
        <h2 class="section-title">여행 경로 검색</h2>
        <input
          type="text"
          v-model="searchTerm"
          placeholder="여행 경로를 입력해주세요"
          class="search-input"
        />
      </div>
      <div class="row">
        <div class="col-lg-3 col-md-6 mb-4" v-for="route in filteredRoutes" :key="route.id">
          <div class="single-team-member" @click="openModal(route.id)">
            <div class="team-member-img">
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
        class="modal-overlay"
        @click.self="closeModal"
      >
        <div class="modal-content">
          <RouteDetail :routeId="selectedRouteId" @close="closeModal" />
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

const fetchRoutes = async () => {
  const page = route.query.no ? parseInt(route.query.no) : 0;
  try {
    const { data: fetchedRoutes } = await axios.get(
      `http://localhost:8080/travel-route`,
      {
        params: { size: pageLimit, page, search: searchTerm.value },
      }
    );
    console.log("Fetched Routes:", fetchedRoutes); // 확인을 위해 콘솔에 로그 출력
    routes.value = fetchedRoutes;
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
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 800px;
  position: relative;
}
</style>