<template>
  <div class="spot-item">
    <h3>{{ spot.title }}</h3>
    <img :src="spot.imgPath" :alt="spot.title" style="width: 100%;">
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
}
</style>
