<template>
  <div id="mapContainer"></div>
</template>

<script>
import axios from "axios";

export default {
  props: ["spots", "openSpotId", "startPoint", "endPoint", "waypoints"],
  data() {
    return {
      map: null,
      markers: [],
      infowindows: [],
      routePath: null,
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
      this.clearMarkers();
      this.infowindows = [];
      if (this.spots && this.spots.length > 0) {
        this.spots.forEach((spot) => {
          const marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(spot.latitude, spot.longitude),
            map: this.map,
          });

          const tags = spot.tag ? spot.tag.split(",").slice(0, 2).join(", ") : "";

          const contentString = `
            <div class="iw_inner">
              <h3>${spot.title}</h3>
              <p>${spot.address}<br />
                ${spot.phoneNumber} | ${tags}<br />
                <img src="${spot.thumbnailPath}" width="300px" class="thumb" /><br />
              </p>
            </div>`;

          const infowindow = new naver.maps.InfoWindow({
            content: contentString,
          });

          naver.maps.Event.addListener(marker, "click", () => {
            if (infowindow.getMap()) {
              infowindow.close();
            } else {
              this.closeAllInfoWindows();
              infowindow.open(this.map, marker);
            }
          });

          this.markers.push(marker);
          this.infowindows.push({ id: spot.id, infowindow, marker });
        });
      }
    },
    clearMarkers() {
      this.markers.forEach((marker) => marker.setMap(null));
      this.markers = [];
    },
    closeAllInfoWindows() {
      this.infowindows.forEach((iw) => {
        iw.infowindow.close();
      });
    },
    openInfoWindow(spotId) {
      this.infowindows.forEach((iw) => {
        if (iw.id === spotId) {
          if (iw.infowindow.getMap()) {
            iw.infowindow.close();
          } else {
            this.closeAllInfoWindows();
            iw.infowindow.open(this.map, iw.marker);
          }
        } else {
          iw.infowindow.close();
        }
      });
    },
    drawRoute(route) {
      if (this.routePath) {
        this.routePath.setMap(null);
      }
      const path = route.map((point) => new naver.maps.LatLng(point[1], point[0]));
      this.routePath = new naver.maps.Polyline({
        map: this.map,
        path: path,
        strokeColor: "#5347AA",
        strokeWeight: 6,
      });
    },
  },
  watch: {
    spots: {
      handler() {
        this.updateMarkers();
      },
      deep: true,
    },
    openSpotId(newVal) {
      this.openInfoWindow(newVal);
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
