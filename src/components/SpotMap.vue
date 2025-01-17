<template>
  <div id="mapContainer"></div>
</template>

<script>
import axios from "axios";

export default {
  props: ["spots", "openSpotId"],
  data() {
    return {
      id: null,
      map: null,
      markers: [],
      infowindows: [], // infowindow들을 저장할 배열
      favoriteSpots: [],
    };
  },
  mounted() {
    this.initializeMap();
    axios
      .get("/users/myInfo", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        this.id = response.data.id;
        this.loadFavorites();
      })
      .catch((error) => {
        console.error("Error fetching user info:", error);
      });
  },
  methods: {
    initializeMap() {
      const mapOptions = {
        center: new naver.maps.LatLng(33.3617, 126.5292),
        zoom: 10,
      };
      this.map = new naver.maps.Map(this.$el, mapOptions);
      this.updateMarkers();

      // Map 클릭 이벤트 추가
      naver.maps.Event.addListener(this.map, 'click', () => {
        this.closeAllInfoWindows();
      });
    },
    loadFavorites() {
      axios
        .get(`/favorite/user/${this.id}`)
        .then((response) => {
          this.favoriteSpots = response.data;
          this.updateMarkers();
        })
        .catch((error) => {
          console.error("Error fetching favorite spots:", error);
        });
    },
    updateMarkers() {
      this.clearMarkers();
      this.infowindows = [];
      if (this.spots && this.spots.length > 0) {
        this.spots.forEach((spot) => {
          const isFavorite = this.favoriteSpots.some(
            (favorite) => favorite.placeId === spot.id
          );

          let markerImage = 'marker_loc_default.png'; // 기본 마커 이미지
          if (spot.type === 'c1') {
            markerImage = 'marker_loc_1.png';
          } else if (spot.type === 'c2') {
            markerImage = 'marker_loc_2.png';
          } else if (spot.type === 'c3') {
            markerImage = 'marker_loc_3.png';
          } else if (spot.type === 'c4') {
            markerImage = 'marker_loc_4.png';
          }

          const marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(spot.latitude, spot.longitude),
            map: this.map,
            icon: {
              url: `/assets/img/${markerImage}`,
              size: new naver.maps.Size(26, 35),
              scaledSize: new naver.maps.Size(26, 35),
            },
          });

          const contentString = [
            `<div class="iw_inner" style="text-align: center; background-color: #f9f9f9; padding: 20px; border-radius: 10px; border: 2px solid #e0e0e0;">`,
            `   <h3 style="color: #333;">${spot.title}</h3>`,
            `   <p style="color: #666; font-size: 14px;">${spot.address}<br />`,
            `       ${spot.phoneNumber} <br/>`,
            `       <div style="display: flex; justify-content: center; margin-top: 15px;">`,
            `           <img src="${spot.thumbnailPath}" class="thumb" style="max-width: 300px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);" />`,
            `       </div>`,
            `   </p>`,
            `   <img src="/assets/img/${isFavorite ? "favoriteOn.png" : "favoriteOff.png"
            }" class="favorite-button" style="width: 32px; height: 32px; cursor: pointer;" data-spot-id="${spot.id}" />`,
            `</div>`,
          ].join("");



          const infowindow = new naver.maps.InfoWindow({
            content: contentString,
          });

          naver.maps.Event.addListener(marker, "click", () => {
            if (infowindow.getMap()) {
              infowindow.close();
            } else {
              this.closeAllInfoWindows(); // 다른 인포 윈도우 닫기
              infowindow.open(this.map, marker);
              this.$nextTick(() => {
                const favoriteButton = document.querySelector(`.favorite-button[data-spot-id="${spot.id}"]`);
                this.addFavoriteListener(favoriteButton, spot.id);
              });
            }
          });

          this.markers.push(marker);
          this.infowindows.push({ id: spot.id, infowindow, marker });
        });
      }
    },
    addFavoriteListener(favoriteButton, spotId) {
      this.removeFavoriteListener(favoriteButton);
      favoriteButton.listener = this.toggleFavorite.bind(
        this,
        spotId,
        favoriteButton
      );
      favoriteButton.addEventListener("click", favoriteButton.listener);
    },
    removeFavoriteListener(favoriteButton) {
      if (favoriteButton && favoriteButton.listener) {
        favoriteButton.removeEventListener("click", favoriteButton.listener);
        favoriteButton.listener = null;
      }
    },
    toggleFavorite(placeId, element) {
      if (!this.id) {
        console.error("User ID is not set.");
        alert("로그인 된 사용자만 가능합니다.");
        return;
      }

      const isFavorite = this.favoriteSpots.some(
        (favorite) => favorite.placeId === placeId
      );

      if (isFavorite) {
        if (
          confirm(
            "This place is already in your favorites! Would you like to remove it?"
          )
        ) {
          const favorite = this.favoriteSpots.find(
            (favorite) => favorite.placeId === placeId
          );
          this.removeFavorite(favorite.id, element);
        }
      } else {
        this.addFavorite(placeId, element);

      }
    },
    addFavorite(placeId, element) {
      axios
        .post("/favorite", {
          placeId: placeId,
          userId: this.id,
        })
        .then(() => {
          alert("Added to favorites!");
          element.src = "/assets/img/favoriteOn.png";
          this.loadFavorites();
        })
        .catch((error) => console.error("Error adding to favorites:", error));
    },
    removeFavorite(favoriteId, element) {
      axios
        .delete(`/favorite/${favoriteId}`)
        .then(() => {
          alert("Removed from favorites!");
          element.src = "/assets/img/favoriteOff.png";
          this.loadFavorites();
        })
        .catch((error) =>
          console.error("Error removing from favorites:", error)
        );
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
            this.closeAllInfoWindows(); // 다른 인포 윈도우 닫기
            iw.infowindow.open(this.map, iw.marker);
            this.$nextTick(() => {
              const favoriteButton = document.querySelector(`.favorite-button[data-spot-id="${spotId}"]`);
              this.addFavoriteListener(favoriteButton, spotId);
            });
          }
        } else {
          iw.infowindow.close();
        }
      });
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
  },
};
</script>

<style scoped>
#mapContainer {
  width: 100%;
  height: 600px;
  max-height: 1000px;
}

#iw_inner {
  text-align: center;
}

.favorite-button {
  cursor: pointer;
}
</style>
