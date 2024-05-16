<template>
  <div id="mapContainer"></div>
</template>

<script>
import axios from "axios";

export default {
  props: ["spots"],
  data() {
    return {
      id: null,
      map: null,
      markers: [],
    };
  },
  mounted() {
    this.initializeMap();
    axios
      .get("http://localhost:8080/users/myInfo", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        console.log(response.data.id);
        this.id = response.data.id;
        console.log("userid set in mounted:", this.id);
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
    },
    updateMarkers() {
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
          `       ${spot.phoneNumber} | ${spot.tag
            .split(",")
            .slice(0, 2)
            .join(", ")}<br />`,
          `       <img src="${spot.thumbnailPath}" width="300px" class="thumb" /><br />`,
          `   </p>`,
          ` <button class="favorite-button">${
            spot.isFavorite ? "Remove from Favorites" : "Add to Favorites"
          }</button>`,
          `</div>`,
        ].join("");

        const infowindow = new naver.maps.InfoWindow({
          content: contentString,
        });

        naver.maps.Event.addListener(marker, "click", () => {
          if (infowindow.getMap()) {
            infowindow.close();
            this.$nextTick(() => {
              const favoriteButton = document.querySelector(".favorite-button");
              this.removeFavoriteListener(favoriteButton);
            });
          } else {
            infowindow.open(this.map, marker);
            this.$nextTick(() => {
              const favoriteButton = document.querySelector(".favorite-button");
              this.addFavoriteListener(favoriteButton, spot.id);
            });
          }
        });

        this.markers.push(marker);
      });
    },
    addFavoriteListener(favoriteButton, spotId) {
      this.removeFavoriteListener(favoriteButton); // Prevent duplicate listeners
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
      console.log(this.id);
      if (!this.id) {
        console.error("User ID is not set.");
        alert("User information is not loaded yet.");
        return;
      }

      // 사용자의 즐겨찾기 목록을 가져와 현재 장소가 즐겨찾기에 있는지 확인
      axios
        .get(`http://localhost:8080/favorite/user/${this.id}`)
        .then((response) => {
          const favorites = response.data;
          const favorite = favorites.find(fav => fav.placeId === placeId);

          if (favorite) {
            // 즐겨찾기에 이미 있으면 제거
            if (
              confirm(
                "This place is already in your favorites! Would you like to remove it?"
              )
            ) {
              this.removeFavorite(favorite.id, element);
            }
          } else {
            // 즐겨찾기에 없으면 추가
            if (
              confirm("Would you like to add this place to your favorites?")
            ) {
              this.addFavorite(placeId, element);
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching favorites:", error);
        });
    },

    // 즐겨찾기 추가
    addFavorite(placeId, element) {
      axios
        .post("http://localhost:8080/favorite", {
          placeId: placeId,
          userId: this.id,
        })
        .then(() => {
          alert("Added to favorites!");
          element.textContent = "Remove from Favorites";
        })
        .catch((error) => console.error("Error adding to favorites:", error));
    },

    // 즐겨찾기 제거
    removeFavorite(favoriteId, element) {
      console.log(favoriteId);
      axios
        .delete(`http://localhost:8080/favorite/${favoriteId}`)
        .then(() => {
          alert("Removed from favorites!");
          element.textContent = "Add to Favorites";
        })
        .catch((error) =>
          console.error("Error removing from favorites:", error)
        );
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
