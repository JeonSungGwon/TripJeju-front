<template>
    <div class="route-detail-container">
      <div class="map-container">
        <RouteMap :route-path="computedRoutePath" :spots="spotDetails" />
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
  
  <script setup>
  import { ref, watch, onMounted, computed } from 'vue';
  import axios from 'axios';
  import { defineProps } from 'vue';
  import RouteMap from '@/components/RouteMap.vue';
  
  const props = defineProps({
    routeId: Number
  });
  
  const spotDetails = ref([]);
  const routeDetails = ref([]);
  const computedRoutePath = ref([]);
  const days = ref([]);
  const sequences = [0, 1, 2, 3, 4, 5, -1];
  
  const fetchRouteDetails = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8080/route-detail/route/${props.routeId}`);
      routeDetails.value = data;
  
      // Set days based on route details
      days.value = [...new Set(data.map(detail => detail.day))].sort((a, b) => a - b);
      
      // Fetch spot details
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
    computedRoutePath.value = points.map(point => {
      const spot = spotDetails.value.find(spot => spot.id === point.placeId);
      return { lat: spot.latitude, lng: spot.longitude, type: point.type };
    });
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
      if (a === 0) return -1; // 출발이 제일 먼저
      if (a === -1) return 1; // 도착이 제일 나중
      if (b === 0) return 1; 
      if (b === -1) return -1;
      return a - b; // 나머지 경유지들은 숫자순으로
    });
  });
  
  onMounted(fetchRouteDetails);
  watch(() => props.routeId, fetchRouteDetails);
  </script>
  
  <style scoped>
  .route-detail-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .map-container {
    width: 100%;
    height: 400px;
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
  