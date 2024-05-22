<template>
  <div class="route-detail-container">
    <div class="map-container">
      <RouteMap 
        ref="routeMap" 
        :spots="spotDetails" 
        :openSpotId="openSpotId" 
        :routeDetails="routeDetails" 
        :routePath="computedRoutePath" 
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
import RouteMap from '@/components/RouteMap.vue';

export default {
  components: {
    RouteMap,
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
      const points = routeDetails.value.filter(detail => detail.day === day);
      const routePoints = points.map(point => {
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

      drawRoute(routePoints);
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
      if (!route || route.length === 0) {
        console.error("Route is empty or not provided");
        return;
      }

      const start = route.find((point) => point.type === "start");
      const end = route.find((point) => point.type === "end");
      const waypoints = route.filter((point) => point.type.startsWith("waypoint"));

      if (!start || !end) {
        console.error("Start or end point is missing", { start, end });
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
      const routeMapComponent = document.querySelector('#mapContainer').__vue__;
      if (routeMapComponent) {
        routeMapComponent.toggleTrafficLayer();
      }
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
      fetchRouteDetails,
      getPoint,
      getSpotTitle,
      getPointTypeLabel,
      formatTime,
      showRoute,
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
