<template>
  <div class="breadcroumb-area bread-bg">
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <div class="breadcroumb-title text-center">
            <h1>{{ currentPageTitle }}</h1>
            <h6><router-link to="/">Home</router-link> / {{ currentPageTitle }}</h6>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();
const currentPageTitle = ref("");

onMounted(async () => {
  let currentPath = "";
  switch (route.name) {
    case "about":
      currentPath = "About Us";
      break;
    case "choose-us":
      currentPath = "Choose Us";
      break;
    case "team":
      currentPath = "Our Team";
      break;
    case "price":
      currentPath = "Pricing Plan";
      break;
    case "faq":
      currentPath = "FAQ";
      break;
    case "service-1":
      currentPath = "Service - 01";
      break;
    case "service-2":
      currentPath = "Service - 02";
      break;
    case "service-details":
      currentPath = "Service Details";
      break;
    case "project":
      currentPath = "Project";
      break;
    case "project-details":
      currentPath = "Project Details";
      break;
    case "blog":
      currentPath = "Blog";
      break;
    case "blog-details":
      currentPath = "Blog Details";
      break;
    case "contact":
      currentPath = "Contact";
      break;
    case "festival":
      currentPath = "제주도 축제";
      break;
    case "tour":
      currentPath = "제주도 관광지";
      break;
    case "food":
      currentPath = "제주도 음식";
      break;
    case "lodge":
      currentPath = "제주도 숙소";
      break;
    case "shop":
      currentPath = "제주도 쇼핑";
      break;
    case "tripReview":
      currentPath = "여행지 후기";
      break;
    case "route":
      currentPath = "일정 추천  ";
      break;
    case "reviewBoard":
      const currentUrl = new URL(window.location.href);
      const id = currentUrl.searchParams.get("id");
      try {
        const response = await axios.get(`http://localhost:8080/spots/id/${id}`);
        const title = response.data.title;
        currentPath = title;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      break;
    default:
      currentPath = route.name;
      break;
  }
  currentPageTitle.value = currentPath;
});
</script>

<style scoped>
/* Your CSS styles here */
</style>
