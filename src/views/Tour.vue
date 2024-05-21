<template>
  <HeaderOne />
  <BreadCrumb />
  <div>
    <SpotFilter @update-filter="updateFilter" type="c1" />
    <div id="container">
      <div id="mainContainer">
        <div class="content">
          <SpotItem
            v-for="spot in spots"
            :key="spot.id"
            :spot="spot"
            @open-marker-window="openMarkerWindow"
          />
        </div>
      </div>
      <div id="mapContainer">
        <SpotMap :spots="spots" :open-spot-id="openSpotId" />
      </div>
    </div>
    <div id="pagination">
      <button @click="goToPage(0)" :disabled="currentPage === 0">First</button>
      <button @click="changePageRange(-10)" :disabled="currentPage < 10">-10</button>
      <span
        v-for="page in pageRange"
        :key="page"
        :class="{ active: page === currentPage + 1 }"
        @click="goToPage(page - 1)"
        >{{ page }}</span
      >
      <button @click="changePageRange(10)" :disabled="currentPage + 10 >= totalPages">+10</button>
      <button @click="goToPage(totalPages - 1)" :disabled="currentPage + 1 === totalPages">Last</button>
    </div>
  </div>
</template>

<script>
import { HeaderOne, BreadCrumb } from "../components";
import SpotItem from "@/components/SpotItem.vue";
import SpotMap from "@/components/SpotMap.vue";
import SpotFilter from "@/components/SpotFilter.vue";

export default {
  components: {
    HeaderOne,
    BreadCrumb,
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
      tag: '',
      reg1: '',
      reg2: '',
      title: '',
      type: 'c1',
      openSpotId: null, // 현재 열려있는 스팟의 ID
      pageRange: [],
    };
  },
  mounted() {
    this.loadSpots();
  },
  watch: {
    currentPage(newPage) {
      this.updatePageRange();
    },
  },
  methods: {
    updateFilter({ tag, reg1, reg2, title }) {
      this.tag = tag;
      this.reg1 = reg1;
      this.reg2 = reg2;
      this.title = title;

      this.currentPage = 0;
      this.loadSpots();
    },
    loadSpots() {
      const params = new URLSearchParams();
      if (this.tag) params.append('tag', this.tag);
      if (this.reg1) params.append('reg1', this.reg1);
      if (this.reg2) params.append('reg2', this.reg2);
      if (this.title) params.append('title', this.title);
      params.append('type', this.type);
      params.append('page', this.currentPage);
      params.append('size', this.pageSize);

      fetch(`http://localhost:8080/spots/search?${params.toString()}`)
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok");
          return response.json();
        })
        .then((data) => {
          this.spots = data.spots;
          this.totalPages = Math.ceil(data.total / this.pageSize);
          this.updatePageRange();
        })
        .catch((error) => {
          console.error("Error fetching spots:", error);
        });
    },
    previousPage() {
      if (this.currentPage > 0) {
        this.currentPage -= 1;
        this.loadSpots();
      }
    },
    nextPage() {
      if (this.currentPage + 1 < this.totalPages) {
        this.currentPage += 1;
        this.loadSpots();
      }
    },
    goToPage(page) {
      this.currentPage = page;
      this.loadSpots();
    },
    changePageRange(delta) {
      this.currentPage += delta;
      if (this.currentPage < 0) this.currentPage = 0;
      if (this.currentPage >= this.totalPages) this.currentPage = this.totalPages - 1;
      this.loadSpots();
    },
    updatePageRange() {
      const start = Math.floor(this.currentPage / 10) * 10;
      const end = Math.min(start + 10, this.totalPages);
      this.pageRange = [];
      for (let i = start; i < end; i++) {
        this.pageRange.push(i + 1);
      }
    },
    openMarkerWindow(spotId) {
      this.openSpotId = spotId;
    },
  },
};
</script>

<style>
#container {
  display: flex;
  height: 100%;
  width: 80%;
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

#mainContainer {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 600px;
  overflow-y: auto;
  padding: 20px;
  background-color: #ffffff;
  border-right: 1px solid #e0e0e0;
}

#mapContainer {
  flex: 3;
  height: 100%;
  padding: 20px;
  background-color: #ffffff;
}

#pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}

#pagination button,
#pagination span {
  margin: 0 5px;
  padding: 8px 12px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

#pagination button:disabled,
#pagination span.active {
  background-color: #ff5722;
  color: #ffffff;
  cursor: default;
}

#pagination button:disabled {
  opacity: 0.6;
}

#pagination span {
  cursor: pointer;
}

#pagination span:hover {
  background-color: #ff8a50;
  color: #ffffff;
}

#mainContainer .content {
  flex: 1;
  overflow-y: auto;
}
</style>
