<template>
  <HeaderOne/>
  <BreadCrumb/>
  <div class="team-area gray-bg section-padding">
    <div class="container">           
    
      <div class="text-center mb-4">
        <!-- 월 선택 버튼들 -->
        <button v-for="month in months" :key="month" @click="changeMonth(month)" class="btn btn-primary mx-1">{{ month }}월</button>
      </div>

      <div class="row">
        <div class="col-lg-3 col-md-6"
          v-for="tm in team.slice(0,100)" :key="tm.id"
        >
          <div class="single-team-member">
            <div class="team-member-img">
              <img :src="tm.imgPath" alt="" height="300" width="281">
            </div>
            <div class="team-content">
              <div class="team-title">
                <a href="#">{{ tm.title }}</a>
              </div>
              <div class="team-subtitle">
                <p>{{ tm.sub_title }}</p>
              </div>np
              <ul class="team-social">
                <li><a href="#"><i class="fa fa-facebook-f" aria-hidden="true"></i> </a></li>
                <li><a href="#"><i class="fa fa-twitter" aria-hidden="true"></i> </a></li>
                <li><a href="#"><i class="fa fa-instagram" aria-hidden="true"></i> </a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref} from 'vue'
import axios from "axios";
import { BreadCrumb, HeaderOne } from "../components";

const team = ref([]);
const selectedMonth = ref("01"); // 기본값은 01로 설정

const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

onMounted(async () => {
  await fetchData();
});

async function fetchData() {
  const { data: fetchedTeam } = await axios.get(`http://localhost:8080/spots/month/c5/${selectedMonth.value}`);
  team.value = fetchedTeam;
}

async function changeMonth(month) {
  selectedMonth.value = month;
  await fetchData();
}
</script>

<style scoped>
/* 추가적인 스타일링이 필요한 경우 여기에 작성하세요 */
</style>
