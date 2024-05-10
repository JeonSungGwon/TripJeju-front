<template>
  <div id="mapContainer"></div>
</template>

<script>
export default {
  mounted() {
    this.initializeMap();
  },
  methods: {
    initializeMap() {
      const mapOptions = {
        center: new naver.maps.LatLng(33.3617, 126.5292),
        zoom: 10
      };
      new naver.maps.Map(this.$el, mapOptions);
    }
  }
}
</script>

<style scoped>
#mapContainer {
  width: 100%;
  height: 500px;
}
</style>
