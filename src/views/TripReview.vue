<template>
  <HeaderOne />
  <BreadCrumb />
  <div class="team-area gray-bg section-padding">
    <div class="container">
      <div class="search-container">
        <h2 class="section-title">여행지 검색</h2>
        <input
          type="text"
          v-model="searchTerm"
          placeholder="여행지를 입력해주세요"
          class="search-input"
        />
      </div>
      <div class="row">
        <div
          class="col-lg-3 col-md-6 mb-4"
          v-for="tm in filteredTeam"
          :key="tm.id"
        >
          <div class="single-team-member">
            <div class="team-member-img" style="margin-bottom: 54px">
              <img :src="tm.thumbnailPath" alt="" height="300" width="281" />
            </div>
            <div class="team-content">
              <div class="team-title">
                <router-link
                  :to="`/reviewBoard?id=${tm.id}`"
                  class="team-link"
                  >{{ tm.title }}</router-link
                >
              </div>
              <div class="team-subtitle">
                <p>{{ tm.sub_title }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <page-link :searchTerm="searchTerm" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
import { BreadCrumb, HeaderOne } from "../components";
import PageLink from "@/components/PageLink.vue";

const pageLimit = 12;
const pageOffet = ref(0);
const team = ref([]);
const route = useRoute();
const searchTerm = ref("");

onMounted(initComponent);
watch(() => route.query, initComponent);
watch(searchTerm, initComponent);

async function initComponent() {
  const { data: fetchedTeam } = await axios.get(`/spots`, {
    params: {
      size: pageLimit,
      page: `${route.query.no - pageLimit} `,
      search: searchTerm.value,
    },
  });
  team.value = fetchedTeam;
}

const filteredTeam = computed(() => {
  return team.value.filter((tm) => {
    return tm.title.toLowerCase().includes(searchTerm.value.toLowerCase());
  });
});
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
  padding: -4px;
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
</style>
