<template>
  <div>
    <div id="container">
      <div id="mainContainer">
        <div class="routeSetting">
          <div>
            <label for="title"><strong>제목:</strong></label>
            <input type="text" id="title" v-model="travelRoute.title" />
          </div>
          <div>
            <label for="startAt"><strong>출발일:</strong></label>
            <input
              type="date"
              id="startAt"
              v-model="travelRoute.startAt"
              @change="updateDays"
            />
          </div>
          <div>
            <label for="finishAt"><strong>도착일:</strong></label>
            <input
              type="date"
              id="finishAt"
              v-model="travelRoute.finishAt"
              @change="updateDays"
            />
          </div>
        </div>
        <div class="content">
          <RouteItem
            v-for="spotId in favoriteSpotIds"
            :key="spotId"
            :spot-id="spotId"
            @open-marker-window="openMarkerWindow"
            @set-start="addPoint('start', spotId)"
            @set-end="addPoint('end', spotId)"
            @add-waypoint="addPoint('waypoint', spotId)"
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
          :route-details="sortedRouteDetails[selectedDay]"
          :route-path="computedRoutePath"
        />
        <div class="detailSetting">
          <div>
            <label for="selectedDay"><strong>날짜 선택:</strong></label>
            <select
              id="selectedDay"
              v-model="selectedDay"
              @change="updateSelectedDay"
            >
              <option v-for="(day, index) in days" :key="index" :value="index">
                {{ index + 1 }}일차
              </option>
            </select>
          </div>
          <div v-for="(day, index) in days" :key="index">
            <h3>{{ index + 1 }}일차</h3>
            <button @click="showRoute(index)">경로 보기</button>
            <table>
              <thead>
                <tr>
                  <th>경로</th>
                  <th>장소명</th>
                  <th>출발시간</th>
                  <th>도착시간</th>
                  <th>삭제버튼</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(point, idx) in sortedRouteDetails[index]"
                  :key="idx"
                >
                  <td>{{ point.type }}</td>
                  <td>{{ getSpotTitle(point.placeId) }}</td>
                  <td><input type="time" v-model="point.startTime" /></td>
                  <td><input type="time" v-model="point.finishTime" /></td>
                  <td>
                    <button @click="removePoint(index, idx)">삭제</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <button @click="saveRoute" :disabled="!isDateSet">일정 만들기</button>
        </div>
      </div>
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
      travelRoute: {
        title: "",
        startAt: "",
        finishAt: "",
      },
      days: [],
      routeDetails: [],
      selectedDay: 0,
      computedRoutePath: [],
    };
  },
  computed: {
    sortedRouteDetails() {
      return this.routeDetails.map((details) =>
        [...details].sort(
          (a, b) => this.getSortOrder(a.type) - this.getSortOrder(b.type)
        )
      );
    },
    isDateSet() {
      return this.travelRoute.startAt && this.travelRoute.finishAt;
    },
  },
  mounted() {
    this.loadUserInfo();
  },
  methods: {
    loadUserInfo() {
      axios
        .get("/users/myInfo", {
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
        .get(`/favorite/user/${this.userId}`)
        .then((response) => {
          this.favoriteSpotIds = response.data.map((fav) => fav.placeId);
          this.loadSpotDetails();
        })
        .catch((error) => {
          console.error("Error fetching favorite spots:", error);
        });
    },
    loadSpotDetails() {
      this.spotDetails = [];
      this.favoriteSpotIds.forEach((spotId) => {
        axios
          .get(`/spots/id/${spotId}`)
          .then(response => {
            this.spotDetails.push(response.data);
          })
          .catch((error) => {
            console.error(
              `Error fetching spot details for ID ${spotId}:`,
              error
            );
          });
      });
    },
    getSpotTitle(spotId) {
      const spot = this.spotDetails.find((spot) => spot.id === spotId);
      return spot ? spot.title : "";
    },
    updateDays() {
      const startAt = new Date(this.travelRoute.startAt);
      const finishAt = new Date(this.travelRoute.finishAt);
      if (isNaN(startAt) || isNaN(finishAt)) return;

      const days = Math.ceil((finishAt - startAt) / (1000 * 60 * 60 * 24)) + 1;

      this.days = [];
      for (let i = 1; i <= days; i++) {
        this.days.push(i);
        this.routeDetails[i - 1] = this.routeDetails[i - 1] || [];
      }

      // Reset routePath when the dates change
      this.computedRoutePath = [];
    },
    updateSelectedDay() {
      if (this.selectedDay >= this.days.length) {
        this.selectedDay = this.days.length - 1;
      }
    },
    addPoint(type, spotId) {
      if (!this.travelRoute.startAt || !this.travelRoute.finishAt) {
        alert("먼저 출발일과 도착일을 설정하세요.");
        return;
      }

      const dayIndex = this.selectedDay;
      const dayDetails = this.routeDetails[dayIndex];

      if (type === "start" || type === "end") {
        const existingIndex = dayDetails.findIndex(
          (point) => point.type === type
        );
        if (existingIndex !== -1) {
          dayDetails[existingIndex].placeId = spotId;
        } else {
          if (
            type === "start" &&
            dayDetails.some((point) => point.type === "start")
          ) {
            dayDetails.splice(
              dayDetails.findIndex((point) => point.type === "start"),
              1
            );
          }
          if (
            type === "end" &&
            dayDetails.some((point) => point.type === "end")
          ) {
            dayDetails.splice(
              dayDetails.findIndex((point) => point.type === "end"),
              1
            );
          }
          dayDetails.push({
            type,
            placeId: spotId,
            startTime: "",
            finishTime: "",
          });
        }
      } else if (type === "waypoint") {
        const waypoints = dayDetails.filter(
          (point) => point.type === "waypoint"
        );
        if (waypoints.length >= 5) {
          alert("경유지는 최대 5개까지 추가할 수 있습니다.");
          return;
        }
        if (waypoints.some((point) => point.placeId === spotId)) {
          alert("경유지가 중복되었습니다.");
          return;
        }
        dayDetails.push({
          type,
          placeId: spotId,
          startTime: "",
          finishTime: "",
        });
      }
    },
    removePoint(dayIndex, pointIndex) {
      this.routeDetails[dayIndex].splice(pointIndex, 1);
    },
    getSortOrder(type) {
      if (type === "start") return 0;
      if (type === "waypoint") return 1;
      if (type === "end") return 2;
    },
    async saveRoute() {
      // 첫날 출발 장소의 thumbnail_path를 가져옵니다.
      const firstDay = this.routeDetails[0];
      const startPoint = firstDay ? firstDay.find(point => point.type === 'start') : null;

      if (!startPoint) {
        alert("첫날 출발 장소를 설정해주세요.");
        return;
      }

      const spot = this.spotDetails.find(spot => spot.id === startPoint.placeId);
      if (!spot) {
        alert("첫날 출발 장소의 상세 정보를 찾을 수 없습니다.");
        return;
      }

      const travelRoute = {
        userId: this.userId,
        routeName: this.travelRoute.title,
        startAt: this.travelRoute.startAt,
        finishAt: this.travelRoute.finishAt,
        img: spot.thumbnailPath, // 첫날 출발 장소의 thumbnail_path를 저장합니다.
      };

      try {
        const response = await axios.post("http://localhost:8080/travel-route", travelRoute);
        const routeId = response.data.id;
        await this.saveRouteDetails(routeId);
        alert("Route saved successfully!");
      } catch (error) {
        console.error("Error saving travel route:", error);
      }
    },
    async saveRouteDetails(routeId) {
      const routeDetails = this.routeDetails.flatMap((details, dayIndex) =>
        details.map((detail, index) => ({
          routeId,
          placeId: detail.placeId,
          day: dayIndex + 1,
          sequence: this.getSequence(detail.type, index, details),
          startAt: this.combineDateAndTime(
            this.travelRoute.startAt,
            dayIndex,
            detail.startTime
          ),
          finishAt: this.combineDateAndTime(
            this.travelRoute.startAt,
            dayIndex,
            detail.finishTime
          ),
        }))
      );

      const saveDetail = (detail) => {
        return axios.post("/route-detail", detail);
      };

      try {
        await Promise.all(routeDetails.map(saveDetail));
      } catch (error) {
        console.error("Error saving route details:", error);
      }
    },
    combineDateAndTime(startDate, dayIndex, time) {
      if (!time) return null;
      const date = new Date(startDate);
      date.setDate(date.getDate() + dayIndex);
      const [hours, minutes] = time.split(":");
      date.setHours(hours, minutes);
      return date.toISOString().replace("T", " ").substr(0, 19); // Format to 'YYYY-MM-DD HH:MM:SS'
    },
    getSequence(type, index, details) {
      if (type === "start") return 0;
      if (type === "end") return -1;
      if (type === "waypoint")
        return (
          details
            .filter((point) => point.type === "waypoint")
            .indexOf(details[index]) + 1
        );
    },
    openMarkerWindow(spotId) {
      this.openSpotId = spotId;
    },
    showRoute(dayIndex) {
      const routePoints = this.sortedRouteDetails[dayIndex].map((point) => {
        const spot = this.spotDetails.find((spot) => spot.id === point.placeId);
        return { lat: spot.latitude, lng: spot.longitude, type: point.type };
      });

      this.drawRoute(routePoints);
    },
    drawRoute(route) {
      if (!route || route.length === 0) {
        console.error("Route is empty or not provided");
        return;
      }

      const start = route.find((point) => point.type === "start");
      const end = route.find((point) => point.type === "end");
      const waypoints = route.filter((point) => point.type === "waypoint");

      if (!start || !end) {
        console.error("Start or end point is missing");
        return;
      }

      const waypointPositions = waypoints
        .map((point) => `${point.lng},${point.lat}`)
        .join("|");
      const startPos = `${start.lng},${start.lat}`;
      const endPos = `${end.lng},${end.lat}`;
      const waypointsParam = waypointPositions
        ? `&waypoints=${waypointPositions}`
        : "";

      const directionsServiceUrl = `/api/map-direction/v1/driving?start=${startPos}&goal=${endPos}${waypointsParam}`;

      axios
        .get(directionsServiceUrl, {
          baseURL: "",
          headers: {
            "X-NCP-APIGW-API-KEY-ID": import.meta.env.VITE_NAVER_CLIENT_ID, // 네이버 클라우드 플랫폼의 Client ID
            "X-NCP-APIGW-API-KEY": import.meta.env.VITE_NAVER_CLIENT_SECRET, // 네이버 클라우드 플랫폼의 Client Secret
          },
        })
        .then((response) => {
          if (
            response.data.route &&
            response.data.route.traoptimal &&
            response.data.route.traoptimal.length > 0
          ) {
            const path = response.data.route.traoptimal[0].path.map(
              (coord) => new naver.maps.LatLng(coord[1], coord[0])
            );
            this.computedRoutePath = path; // 수정된 경로를 저장
          } else {
            console.error(
              "No traoptimal route found in response",
              response.data
            );
          }
        })
        .catch((error) => {
          console.error("Error fetching directions:", error);
        });
    },
  },
};
</script>

<style>
#container {
  display: flex;
  height: 100%;
  width: 90%;
  margin: 0 auto;
}

#mainContainer {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 800px;
  overflow-y: auto;
  margin-right: 30px;
}
.detailSetting {
  overflow-y: auto;
}
#mapContainer {
  flex: 3;
  height: 100%;
}

table {
  width: 100%;
  border-collapse: collapse;
}

select {
  color: black;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
  text-align: left;
}

button {
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #E16639;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

button:hover:enabled {
  background-color: #c25730;
}

input {
  color: black;
}

strong {
  color: black;
}
</style>