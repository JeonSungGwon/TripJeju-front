<template>
  <div id="mapContainer"></div>
</template>

<script>
import axios from "axios";

export default {
  props: ["spots", "openSpotId", "startPoint", "endPoint", "waypoints", "routeDetails", "routePath", "trafficLayerEnabled"],
  data() {
    return {
      map: null,
      markers: [],
      infowindows: [],
      routePolyline: null,
      markerIcons: {
        start: "/assets/img/icon_navi89_directions.png",
        end: "/assets/img/icon_navi88_directions.png",
        waypoint1: "/assets/img/icon_navi87_1_directions.png",
        waypoint2: "/assets/img/icon_navi87_2_directions.png",
        waypoint3: "/assets/img/icon_navi87_3_directions.png",
        waypoint4: "/assets/img/icon_navi87_4_directions.png",
        waypoint5: "/assets/img/icon_navi87_5_directions.png"
      }
    };
  },
  mounted() {
    this.initializeMap();
  },
  methods: {
    initializeMap() {
      const overlayType = this.trafficLayerEnabled ? 'bg.ol.ts.ctt.lko' : 'bg.ol.ts.lko';
      const mapOptions = {
        center: new naver.maps.LatLng(33.3617, 126.5292),
        zoom: 10,
        mapTypes: new naver.maps.MapTypeRegistry({
          'normal': naver.maps.NaverStyleMapTypeOptions.getNormalMap({
            overlayType: overlayType
          })
        })
      };
      this.map = new naver.maps.Map(this.$el, mapOptions);
      this.updateMarkers();
      this.drawRoute(this.routePath);
    },
    updateMarkers() {
      this.clearMarkers();
      this.infowindows = [];
      if (this.routeDetails && this.routeDetails.length > 0) {
        this.routeDetails.forEach((point) => {
          const spot = this.spots.find((spot) => spot.id === point.placeId);
          if (!spot) return;

          let icon = '';
          if (point.sequence === 0) {
            icon = this.markerIcons.start;
          } else if (point.sequence === -1) {
            icon = this.markerIcons.end;
          } else {
            const waypointIndex = point.sequence;
            icon = this.markerIcons[`waypoint${waypointIndex}`];
          }

          const marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(spot.latitude, spot.longitude),
            map: this.map,
            icon: {
              url: icon,
              size: new naver.maps.Size(25, 35),
              origin: new naver.maps.Point(0, 0),
              anchor: new naver.maps.Point(12, 12),
            }
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
    drawRoute(path) {
      if (this.routePolyline) {
        this.routePolyline.setMap(null);
      }

      if (path && path.length > 0) {
        this.routePolyline = new naver.maps.Polyline({
          map: this.map,
          path: path,
          strokeColor: "#E16639",
          strokeWeight: 3,
        });
        this.map.setCenter(path[0]);
      }
    },
    updateMapOverlay() {
      const overlayType = this.trafficLayerEnabled ? 'bg.ol.ts.ctt.lko' : 'bg.ol.ts.lko';
      const mapOptions = {
        center: this.map.getCenter(),
        zoom: this.map.getZoom(),
        mapTypes: new naver.maps.MapTypeRegistry({
          'normal': naver.maps.NaverStyleMapTypeOptions.getNormalMap({
            overlayType: overlayType
          })
        })
      };
      this.map.destroy();
      this.map = new naver.maps.Map(this.$el, mapOptions);
      this.updateMarkers();
      this.drawRoute(this.routePath);
    }
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
    routeDetails: {
      handler() {
        this.updateMarkers();
      },
      deep: true,
    },
    routePath(newVal) {
      this.drawRoute(newVal);
    },
    trafficLayerEnabled(newVal) {
      this.updateMapOverlay();
    }
  },
};
</script>

<style scoped>
#mapContainer {
  width: 100%;
  height: 400px;
}
</style>
