<template>
  <div v-if="spot" class="spot-item">
    <h5>{{ spot.title }}</h5>
    <img :src="spot.thumbnailPath" :alt="spot.title" style="width: 100%;" />
    <p>{{ spot.introduction }}</p>
    <button @click="setStart">시작</button>
    <button @click="addWaypoint">경유</button>
    <button @click="setEnd">도착</button>
  </div>
  <div v-else class="spot-item">
    Loading...
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    spotId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      spot: null,
    };
  },
  mounted() {
    this.loadSpotDetails();
  },
  methods: {
    loadSpotDetails() {
      axios
        .get(`http://localhost:8080/spots/id/${this.spotId}`)
        .then((response) => {
          this.spot = response.data;
        })
        .catch((error) => {
          console.error(`Error fetching spot details for ID ${this.spotId}:`, error);
        });
    },
    setStart() {
      this.$emit("set-start", this.spot.id);
    },
    setEnd() {
      this.$emit("set-end", this.spot.id);
    },
    addWaypoint() {
      this.$emit("add-waypoint", this.spot.id);
    },
  },
};
</script>

<style scoped>
.spot-item {
  background-color: #f9f9f9;
  padding: 20px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

button {
  margin-top: 10px;
  margin-right: 5px;
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
