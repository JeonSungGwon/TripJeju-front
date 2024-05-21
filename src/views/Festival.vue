<template>
  <HeaderOne />
  <BreadCrumb />
  <div class="team-area gray-bg section-padding">
    <div class="container">
      <div class="text-center mb-4">
        <button v-for="month in months" :key="month" @click="changeMonth(month)" :class="['btn btn-custom mx-1', isActiveMonth(month)]">{{ month }}월</button>
      </div>

      <div class="row">
        <div class="col-lg-4 col-md-6 mb-4" v-for="tm in team.slice(0, 100)" :key="tm.id">
          <div class="single-team-member">
            <div class="team-member-img">
              <img :src="tm.imgPath" alt="" class="img-fluid team-img">
            </div>
            <div class="team-content">
              <div class="team-title">
                <a href="#">{{ tm.title }}</a>
              </div>
              <div class="team-subtitle">
                <p>{{ tm.sub_title }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
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

function isActiveMonth(month) {
  return month === selectedMonth.value ? 'active' : '';
}
</script>

<style scoped>
/* 버튼 스타일 업데이트 */
.btn-custom {
  background-color: transparent; /* 배경색 제거 */
  color: green; /* 글꼴 색상 설정 */
  border: green; /* 테두리 추가 */
  border-radius: 25px;
  padding: 10px 20px;
  font-size: 16px;
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.3s ease;
}

.btn-custom:hover {
  background-color: #F35C27; /* 호버 시 배경색 추가 */
  color: white; /* 호버 시 글꼴 색상 변경 */
  transform: translateY(-2px);
}

/* 선택된 월 버튼 스타일 */
.btn-custom.active {
  background-color: #F35C27;
  color: white;
}

/* 다른 스타일은 그대로 유지 */
.team-area {
  background-color: #f8f9fa;
  padding: 60px 0;
}

.text-center {
  margin-bottom: 40px;
}

.single-team-member {
  background: white;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 400px;
}

.single-team-member:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}

.team-member-img {
  width: 100%;
  height: 250px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.team-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.team-img:hover {
  transform: scale(1.05);
}

.team-content {
  padding: 20px;
  text-align: center;
  height: 150px;
}

.team-title a {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  text-decoration: none;
  transition: color 0.3s ease;
}

.team-title a:hover {
  color: #007bff;
}

.team-subtitle {
  margin-top: 10px;
  color: #777;
}
</style>
