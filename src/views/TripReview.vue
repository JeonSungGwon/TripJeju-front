<template>
  <HeaderOne/>
  <BreadCrumb/>
  <div class="team-area gray-bg section-padding">
    <div class="container">           
      <input type="text" v-model="searchTerm" placeholder="Search by title...">
      <div class="row">
        <div class="col-lg-3 col-md-6" v-for="tm in filteredTeam" :key="tm.id">
          <div class="single-team-member">
            <div class="team-member-img">
              <img :src="tm.thumbnailPath" alt="" height="300" width="281">
            </div>
            <div class="team-content">
              <div class="team-title">
                <router-link :to="`/reviewBoard?id=${tm.id}`">{{ tm.title }}</router-link>
              </div>
              <div class="team-subtitle">
                <p>{{ tm.sub_title }}</p>
              </div>
              <ul class="team-social">
                <li><a href="#"><i class="fa fa-facebook-f" aria-hidden="true"></i> </a></li>
                <li><a href="#"><i class="fa fa-twitter" aria-hidden="true"></i> </a></li>
                <li><a href="#"><i class="fa fa-instagram" aria-hidden="true"></i> </a></li>
              </ul>
            </div>
          </div>
        </div>
        <!--<router-view /> -->
        <page-link />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { BreadCrumb, HeaderOne } from "../components";
import PageLink from '@/components/PageLink.vue'

const pageLimit = 12;
const pageOffet = ref(0);
const team = ref([]);
const route = useRoute();
const searchTerm = ref('');

onMounted(initComponent);
watch(() => route.query, initComponent);
watch(searchTerm, updateFilteredTeam);

async function initComponent() {
  const { data: fetchedTeam } = await axios.get(`http://localhost:8080/spots`,{
    params: { size: pageLimit, page: `${route.query.no - pageLimit}` }
  });
  team.value = fetchedTeam;
}

const filteredTeam = computed(() => {
  return team.value.filter(tm => {
    return tm.title.toLowerCase().includes(searchTerm.value.toLowerCase());
  });
});

function updateFilteredTeam() {
  // No need to do anything here, computed property takes care of filtering.
}
</script>

<style scoped>
/* 추가적인 스타일링이 필요한 경우 여기에 작성하세요 */
</style>
