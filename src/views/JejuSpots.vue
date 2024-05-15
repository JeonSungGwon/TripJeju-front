<template>
  <div id="container">
    <div id="mainContainer">
      <div id="pagination">
        <button @click="previousPage">Previous</button>
        <span>{{ currentPage + 1 }} of {{ totalPages }}</span>
        <button @click="nextPage">Next</button>
      </div>
      <div class="content">
        <SpotItem v-for="spot in spots" :key="spot.id" :spot="spot" />
      </div>
    </div>
    <div id="mapContainer">
      <MapComponent :spots="spots" />
    </div>
  </div>
</template>

<script>
import SpotItem from "@/components/SpotItem.vue";
import MapComponent from "@/components/MapComponent.vue";

export default {
  components: {
    SpotItem,
    MapComponent,
  },
  data() {
    return {
      currentPage: 0,
      pageSize: 10,
      totalPages: 534,
      spots: [],
    };
  },
  mounted() {
    this.loadSpots(this.currentPage);
  },
  methods: {
    loadSpots(page) {
      fetch(`http://localhost:8080/spots?page=${page}&size=${this.pageSize}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          this.spots = data; // 가정: API 응답이 spots 배열을 직접 반환
        });
    },
    previousPage() {
      if (this.currentPage > 0) {
        this.currentPage -= 1;
        this.loadSpots(this.currentPage);
      }
    },
    nextPage() {
      if (this.currentPage + 1 < this.totalPages) {
        this.currentPage += 1;
        this.loadSpots(this.currentPage);
      }
    },
  },
};
</script>

<style>
#container {
  display: flex; /* Flexbox 레이아웃 사용 */
  height: 100%; /* 전체 높이 설정 */
  width: 80%;
  margin: 0 auto;
}

#pagination {
  position: sticky; /* 스티키 포지셔닝 사용 */
  top: 0; /* 컨테이너의 상단에서 0px 위치에 고정 */
  background: white; /* 배경색 지정 (스크롤 시 내용이 가리지 않도록) */
}

#mainContainer {
  flex: 1; /* 1:3 비율 중 1을 차지 */
  height: 600px; /* 자식 요소와 동일한 높이로 설정 */
  overflow-y: auto; /* 세로 스크롤바 자동 생성 */
  display: flex; /* Flexbox 레이아웃 사용 */
  flex-direction: column; /* 자식 요소를 세로로 정렬 */
}

#mainContainer > .content {
  flex: 1; /* 나머지 공간을 모두 차지 */
  overflow-y: auto; /* 필요 시 세로 스크롤바 생성 */
}


#mapContainer {
  flex: 3; /* 1:3 비율 중 3을 차지 */
  height: 100%; /* 자식 요소와 동일한 높이로 설정 */
}
</style>
