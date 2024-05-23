<template>
  <div class="route-detail-container">
    <div class="map-container">
      <RouteDetailMap 
        ref="routeMap" 
        :spots="spotDetails" 
        :open-spot-id="openSpotId"
        :start-point="startPoint"
        :end-point="endPoint"
        :waypoints="waypoints" 
        :route-details="filteredRouteDetails" 
        :route-path="computedRoutePath" 
        :traffic-layer-enabled="trafficLayerEnabled"
      />
      <button @click="toggleTrafficLayer" class="traffic-toggle-btn">
        {{ trafficLayerEnabled ? '혼잡도 끄기' : '혼잡도 켜기' }}
      </button>
    </div>
    <div class="table-container">
      <button @click="scrollLeft">이전</button>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th v-for="day in days" :key="day" class="day-header">
                <div>
                  <span>Day {{ day }}</span>
                  <button @click="showRoute(day)">지도 보기</button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sequence in sortedSequences" :key="sequence">
              <template v-for="day in days" :key="day">
                <td v-if="getPoint(day, sequence)" class="route-info">
                  <div>
                    <span>{{ getPointTypeLabel(sequence) }}</span>
                    <div>{{ getSpotTitle(getPoint(day, sequence).placeId) }}</div>
                    <div v-if="getPoint(day, sequence).startAt && getPoint(day, sequence).finishAt">
                      {{ formatTime(getPoint(day, sequence).startAt) }} ~ {{ formatTime(getPoint(day, sequence).finishAt) }}
                    </div>
                  </div>
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
      <button @click="scrollRight">다음</button>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted, computed } from 'vue';
import axios from 'axios';
import RouteDetailMap from '@/components/RouteDetailMap.vue';

export default {
  components: {
    RouteDetailMap,
  },
  props: {
    routeId: Number
  },
  setup(props) {
    const spotDetails = ref([]);
    const routeDetails = ref([]);
    const computedRoutePath = ref([]);
    const days = ref([]);
    const sequences = [0, 1, 2, 3, 4, 5, -1];
    const trafficLayerEnabled = ref(false);
    const openSpotId = ref(null);
    const startPoint = ref(null);
    const endPoint = ref(null);
    const waypoints = ref([]);
    const filteredRouteDetails = ref([]);

    const fetchRouteDetails = async () => {
      try {
        const { data } = await axios.get(`http://localhost:8080/route-detail/route/${props.routeId}`);
        routeDetails.value = data;

        days.value = [...new Set(data.map(detail => detail.day))].sort((a, b) => a - b);

        const spotIds = [...new Set(data.map(detail => detail.placeId))];
        for (const spotId of spotIds) {
          const { data: spot } = await axios.get(`http://localhost:8080/spots/id/${spotId}`);
          spotDetails.value.push(spot);
        }
      } catch (error) {
        console.error('Error fetching route details:', error);
      }
    };

    const getPoint = (day, sequence) => {
      return routeDetails.value.find(detail => detail.day === day && detail.sequence === sequence);
    };

    const getSpotTitle = (spotId) => {
      const spot = spotDetails.value.find(spot => spot.id === spotId);
      return spot ? spot.title : '';
    };

    const getPointTypeLabel = (sequence) => {
      if (sequence === 0) return '출발';
      if (sequence === -1) return '도착';
      return `경유 ${sequence}`;
    };

    const formatTime = (time) => {
      const date = new Date(time);
      return date.toLocaleTimeString();
    };

    const showRoute = (day) => {
      filteredRouteDetails.value = routeDetails.value.filter(detail => detail.day === day);
      const routePoints = filteredRouteDetails.value.map(point => {
        const spot = spotDetails.value.find(spot => spot.id === point.placeId);
        let type;
        if (point.sequence === 0) {
          type = 'start';
        } else if (point.sequence === -1) {
          type = 'end';
        } else {
          type = `waypoint${point.sequence}`;
        }
        return { lat: spot.latitude, lng: spot.longitude, type: type };
      });

      setRoutePoints(routePoints);
      drawRoute(routePoints);
    };

    const setRoutePoints = (routePoints) => {
      startPoint.value = routePoints.find(point => point.type === 'start');
      endPoint.value = routePoints.find(point => point.type === 'end');
      waypoints.value = routePoints.filter(point => point.type && point.type.startsWith('waypoint'));
    };

    const scrollLeft = () => {
      const tableWrapper = document.querySelector('.table-wrapper');
      tableWrapper.scrollBy({ left: -300, behavior: 'smooth' });
    };

    const scrollRight = () => {
      const tableWrapper = document.querySelector('.table-wrapper');
      tableWrapper.scrollBy({ left: 300, behavior: 'smooth' });
    };

    const sortedSequences = computed(() => {
      return sequences.sort((a, b) => {
        if (a === 0) return -1;
        if (a === -1) return 1;
        if (b === 0) return 1;
        if (b === -1) return -1;
        return a - b;
      });
    });

    const drawRoute = (route) => {
      if (!startPoint.value || !endPoint.value) {
        console.error("Start or end point is missing", { start: startPoint.value, end: endPoint.value });
        return;
      }

      const waypointPositions = waypoints.value
        .map((point) => `${point.lng},${point.lat}`)
        .join("|");
      const startPos = `${startPoint.value.lng},${startPoint.value.lat}`;
      const endPos = `${endPoint.value.lng},${endPoint.value.lat}`;
      const waypointsParam = waypointPositions
        ? `&waypoints=${waypointPositions}`
        : "";

      const directionsServiceUrl = `/api/map-direction/v1/driving?start=${startPos}&goal=${endPos}${waypointsParam}`;

      axios
        .get(directionsServiceUrl, {
          baseURL:"",
          headers: {
            "X-NCP-APIGW-API-KEY-ID": import.meta.env.VITE_NAVER_CLIENT_ID,
            "X-NCP-APIGW-API-KEY": import.meta.env.VITE_NAVER_CLIENT_SECRET,
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
            computedRoutePath.value = path;
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
    };

    const toggleTrafficLayer = () => {
      trafficLayerEnabled.value = !trafficLayerEnabled.value;
    };

    onMounted(() => {
      fetchRouteDetails();
    });

    watch(() => props.routeId, fetchRouteDetails);

    return {
      spotDetails,
      routeDetails,
      computedRoutePath,
      days,
      sortedSequences,
      trafficLayerEnabled,
      openSpotId,
      startPoint,
      endPoint,
      waypoints,
      filteredRouteDetails,
      fetchRouteDetails,
      getPoint,
      getSpotTitle,
      getPointTypeLabel,
      formatTime,
      showRoute,
      setRoutePoints,
      scrollLeft,
      scrollRight,
      drawRoute,
      toggleTrafficLayer
    };
  }
};
</script>

<style scoped>
.route-detail-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.map-container {
  position: relative;
  width: 100%;
  height: 400px;
}

.traffic-toggle-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #E16639;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  z-index: 10;
}

.traffic-toggle-btn:hover {
  background-color: #c25730;
}

.table-container {
  display: flex;
  align-items: center;
  width: 100%;
  overflow-x: auto;
  margin-top: 20px;
}

.table-wrapper {
  overflow-x: auto;
  width: 100%;
}

table {
  border-collapse: collapse;
  width: max-content;
}

th, tr, td {
  border: 1px solid #ddd;
  padding: 8px;
}

.day-header {
  min-width: 200px;
}

.route-info {
  text-align: center;
}

button {
  background-color: #E16639;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
}

button:hover {
  background-color: #c25730;
}

button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}
</style>
