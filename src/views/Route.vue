<template>
  <HeaderOne />
  <BreadCrumb />
  <div>
    <div id="container">
      <div id="mainContainer">
        <div class="content">
          <RouteItem
            v-for="spotId in favoriteSpotIds"
            :key="spotId"
            :spot-id="spotId"
            @open-marker-window="openMarkerWindow"
            @set-start="setStart"
            @set-end="setEnd"
            @add-waypoint="addWaypoint"
          />
        </div>
      </div>
      <div id="mapContainer">
        <RouteMap
          ref="routeMap"
          :spots="spotDetails"
          :open-spot-id="openSpotId"
          :start-point="startPoint"
          :end-point="endPoint"
          :waypoints="waypoints"
        />
      </div>
    </div>
    <div id="routeOptions">
      <div>
        <strong>Start:</strong>
        <span v-if="startPoint">{{ getSpotTitle(startPoint) }}</span>
      </div>
      <div>
        <strong>End:</strong>
        <span v-if="endPoint">{{ getSpotTitle(endPoint) }}</span>
      </div>
      <div>
        <strong>Waypoints:</strong>
        <span v-for="(waypoint, index) in waypoints" :key="index">
          {{ getSpotTitle(waypoint) }}<span v-if="index < waypoints.length - 1">, </span>
        </span>
      </div>
      <button @click="searchRoute">Search Route</button>
    </div>
  </div>
</template>

<script>
import { HeaderOne, BreadCrumb } from "../components";
import RouteItem from "@/components/RouteItem.vue";
import RouteMap from "@/components/RouteMap.vue";
import axios from "axios";

export default {
  components: {
    HeaderOne,
    BreadCrumb,
    RouteItem,
    RouteMap,
  },
  data() {
    return {
      userId: null,
      favoriteSpotIds: [],
      spotDetails: [],
      openSpotId: null,
      startPoint: null,
      endPoint: null,
      waypoints: [],
    };
  },
  mounted() {
    this.loadUserInfo();
  },
  methods: {
    loadUserInfo() {
      axios
        .get("http://localhost:8080/users/myInfo", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then((response) => {
          this.userId = response.data.id;
          this.loadFavoriteSpots();
        })
        .catch((error) => {
          console.error("Error fetching user info:", error);
        });
    },
    loadFavoriteSpots() {
      axios
        .get(`http://localhost:8080/favorite/user/${this.userId}`)
        .then((response) => {
          this.favoriteSpotIds = response.data.map(fav => fav.placeId);
          this.loadSpotDetails();
        })
        .catch((error) => {
          console.error("Error fetching favorite spots:", error);
        });
    },
    loadSpotDetails() {
      this.spotDetails = [];
      this.favoriteSpotIds.forEach(spotId => {
        axios
          .get(`http://localhost:8080/spots/id/${spotId}`)
          .then(response => {
            this.spotDetails.push(response.data);
          })
          .catch(error => {
            console.error(`Error fetching spot details for ID ${spotId}:`, error);
          });
      });
    },
    openMarkerWindow(spotId) {
      this.openSpotId = spotId;
    },
    setStart(spotId) {
      this.startPoint = spotId;
    },
    setEnd(spotId) {
      this.endPoint = spotId;
    },
    addWaypoint(spotId) {
      if (this.waypoints.length < 13 && !this.waypoints.includes(spotId)) {
        this.waypoints.push(spotId);
      }
    },
    getSpotTitle(spotId) {
      const spot = this.spotDetails.find((spot) => spot.id === spotId);
      return spot ? spot.title : "";
    },
    searchRoute() {
      if (!this.startPoint || !this.endPoint) {
        alert("Please select both start and end points.");
        return;
      }
      const start = this.spotDetails.find((spot) => spot.id === this.startPoint);
      const end = this.spotDetails.find((spot) => spot.id === this.endPoint);
      const waypoints = this.waypoints.map((id) => {
        const spot = this.spotDetails.find((spot) => spot.id === id);
        return `${spot.longitude},${spot.latitude}`;
      });

      const apiType = waypoints.length + 2 <= 5 ? "" : "-15"; // Determine whether to use API 5 or 15

      // 네이버 지도 Directions API를 호출하여 경로를 검색합니다.
      axios
        .get(`/api/map-direction${apiType}/v1/driving`, {
          params: {
            start: `${start.longitude},${start.latitude}`,
            goal: `${end.longitude},${end.latitude}`,
            waypoints: waypoints.join("|"),
          },
          headers: {
            "X-NCP-APIGW-API-KEY-ID": import.meta.env.VITE_NAVER_CLIENT_ID,
            "X-NCP-APIGW-API-KEY": import.meta.env.VITE_NAVER_CLIENT_SECRET,
          },
        })
        .then((response) => {
          const route = response.data.route.traoptimal[0].path;
          this.$refs.routeMap.drawRoute(route);
        })
        .catch((error) => {
          console.error("Error fetching route:", error);
        });
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

#routeOptions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
}

#routeOptions div {
  margin: 5px 0;
}

button {
  margin-top: 10px;
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
