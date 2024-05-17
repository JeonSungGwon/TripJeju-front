<template>
  <div id="filterContainer">
    <SpotFilter @update-filter="updateFilter" />
  </div>
  <div id="container">
    <div id="mainContainer">
      <div id="pagination">
        <button @click="previousPage" :disabled="currentPage === 0">Previous</button>
        <span>{{ currentPage + 1 }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage + 1 === totalPages">Next</button>
      </div>
      <div class="content">
        <SpotItem v-for="spot in spots" :key="spot.id" :spot="spot" />
      </div>
    </div>
    <div id="mapContainer">
      <SpotMap :spots="spots" />
    </div>
  </div>
</template>

<script>
import SpotItem from "@/components/SpotItem.vue";
import SpotMap from "@/components/SpotMap.vue";
import SpotFilter from "@/components/SpotFilter.vue";

export default {
  components: {
    SpotItem,
    SpotMap,
    SpotFilter,
  },
  data() {
    return {
      currentPage: 0,
      pageSize: 10,
      totalPages: 0,
      spots: [],
      title: '',
      tag: '',
      type: '',
      reg1: '',
      reg2: '',
    };
  },
  mounted() {
    this.loadSpots();
  },
  methods: {
    updateFilter({ title, tag, type, reg1, reg2 }) {
      if (title !== undefined) this.title = title;
      if (tag !== undefined) this.tag = tag;
      if (type !== undefined) this.type = type;
      if (reg1 !== undefined) this.reg1 = reg1;
      if (reg2 !== undefined) this.reg2 = reg2;
      
      this.currentPage = 0; // 필터가 변경되면 첫 페이지로 이동
      this.loadSpots();
    },
    loadSpots() {
      const params = new URLSearchParams();
      if (this.title) params.append('title', this.title);
      if (this.tag) params.append('tag', this.tag);
      if (this.type) params.append('type', this.type);
      if (this.reg1) params.append('reg1', this.reg1);
      if (this.reg2) params.append('reg2', this.reg2);
      params.append('page', this.currentPage);
      params.append('size', this.pageSize);

      fetch(`http://localhost:8080/spots/search?${params.toString()}`)
        .then(response => {
          if (!response.ok) throw new Error("Network response was not ok");
          return response.json();
        })
        .then(data => {
          this.spots = data.spots; // 기존 데이터 대신 새 데이터를 설정
          this.totalPages = Math.ceil(data.total / this.pageSize);
        })
        .catch(error => {
          console.error("Error fetching spots:", error);
        });
    },
    previousPage() {
      if (this.currentPage > 0) {
        this.currentPage -= 1;
        this.loadSpots(this.currentPage); // 이전 페이지로 이동할 때 데이터 로드
      }
    },
    nextPage() {
      if (this.currentPage + 1 < this.totalPages) {
        this.currentPage += 1;
        this.loadSpots(this.currentPage); // 다음 페이지로 이동할 때 데이터 로드
      }
    },
  },
};
</script>

<style>
#filterContainer {
  display: flex;
  width: 80%;
  margin: 0 auto;
}

#container {
  display: flex;
  height: 100%;
  width: 80%;
  margin: 0 auto;
}

#mainContainer {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 600px;
  overflow-y: auto;
}

#mapContainer {
  flex: 3;
  height: 100%;
}

#pagination {
  position: sticky;
  top: 0;
  background: white;
}

#mainContainer .content {
  flex: 1;
  overflow-y: auto;
}
</style>
