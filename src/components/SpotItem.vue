<template>
  <div class="spot-item" @click="openMarkerWindow">
    <div :class="['spot-banner', { 'favorite-banner': isFavorite }]"></div>
    <h5>{{ spot.title }}</h5>
    <img :src="spot.thumbnailPath" :alt="spot.title" class="spot-image">
    <p>{{ spot.introduction }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    spot: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      userId: null,
      isFavorite: false
    };
  },
  methods: {
    openMarkerWindow() {
      this.$emit('open-marker-window', this.spot.id);
    },
    async fetchUserInfo() {
      try {
        const response = await axios.get('/users/myInfo', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
        this.userId = response.data.id;
        this.checkFavoriteStatus();
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    },
    async checkFavoriteStatus() {
      if (!this.userId || !this.spot.id) return;
      
      try {
        const response = await axios.get(`favorite/user/${this.userId}/spot/${this.spot.id}`);
        this.isFavorite = response.data;
      } catch (error) {
        console.error('Failed to check favorite status:', error);
      }
    }
  },
  mounted() {
    this.fetchUserInfo();
  }
}
</script>

<style scoped>
.spot-item {
  background-color: #ffffff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #e0e0e0;
  position: relative;
}

.spot-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.spot-banner {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 10px;
  background-color: orange;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.favorite-banner {
  background-color: red !important;
}

.spot-item h5 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #333;
}

.spot-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 15px;
}

.spot-item p {
  font-size: 1rem;
  color: #666;
}
</style>
