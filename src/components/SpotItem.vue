<template>
  <div class="spot-item" @click="openMarkerWindow">
    <h5>{{ spot.title }}</h5>
    <img :src="spot.thumbnailPath" :alt="spot.title" style="width: 100%;">
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
  background-color: #f9f9f9;
  padding: 20px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  cursor: pointer;
}
</style>
