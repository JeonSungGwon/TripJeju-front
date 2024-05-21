<template>
  <div class="spot-item" @click="openMarkerWindow">
    <div class="spot-banner"></div>
    <h5>{{ spot.title }}</h5>
    <img :src="spot.thumbnailPath" :alt="spot.title" class="spot-image">
    <p>{{ spot.introduction }}</p>
  </div>
</template>

<script>
export default {
  props: {
    spot: {
      type: Object,
      required: true
    }
  },
  methods: {
    openMarkerWindow() {
      this.$emit('open-marker-window', this.spot.id);
    }
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
  border: 1px solid #e0e0e0; /* 카드의 테두리를 추가하여 구분 */
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
  background-color: orange; /* 카드 상단에 배너 색상 추가 */
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
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
