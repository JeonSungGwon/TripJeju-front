<template>

  <div id="mainContainer">
    <SpotItem v-for="spot in spots" :key="spot.id" :spot="spot" />
    <MapComponent />
    <div id="pagination">
      <button @click="previousPage">Previous</button>
      <span id="pageNumbers">Page {{ currentPage + 1 }} of {{ totalPages }}</span>
      <button @click="nextPage">Next</button>
    </div>
  </div>
</template>

<script>
import SpotItem from '@/components/SpotItem.vue';
import MapComponent from '@/components/MapComponent.vue';

export default {
  components: {
    SpotItem,
    MapComponent
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
      // API 호출 및 spots 데이터 설정
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
    }
  }
}
</script>
