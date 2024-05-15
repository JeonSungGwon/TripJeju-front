<template>
  <div id="mapContainer"></div>
</template>

<script>
export default {
  props: ["spots"],
  data() {
    return {
      map: null,
      markers: [],
    };
  },
  mounted() {
    this.initializeMap();
  },
  methods: {
    initializeMap() {
      const mapOptions = {
        center: new naver.maps.LatLng(33.3617, 126.5292),
        zoom: 10,
      };
      this.map = new naver.maps.Map(this.$el, mapOptions);
      this.updateMarkers();
    },
    updateMarkers() {
      var map = this.map;
      this.clearMarkers();
      this.spots.forEach((spot) => {
        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(spot.latitude, spot.longitude),
          map: this.map,
        });

        var contentString = [
          `<div class="iw_inner">`,
          `   <h3>${spot.title}</h3>`,
          `   <p>${spot.address}<br />`,
          `       ${spot.phoneNumber} | ${spot.tag.split(",").slice(0, 2).join(", ")}<br />`,
          `       <img src="${spot.thumbnailPath}" width="300px" class="thumb" /><br />`,
          `   </p>`,
          `</div>`,
        ].join("");

        var infowindow = new naver.maps.InfoWindow({
          content: contentString,
        });

        naver.maps.Event.addListener(marker, "click", function (e) {
          if (infowindow.getMap()) {
            infowindow.close();
          } else {
            infowindow.open(map, marker);
          }
        });
        this.markers.push(marker);
      });
    },
    clearMarkers() {
      this.markers.forEach((marker) => marker.setMap(null));
      this.markers = [];
    },
  },
  watch: {
    spots: {
      handler() {
        this.updateMarkers();
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
#mapContainer {
  width: 100%;
  height: 600px;
  max-height: 1000px;
}
</style>
