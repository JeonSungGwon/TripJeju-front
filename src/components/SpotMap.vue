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
      favoriteSpots: [], // Store user's favorite spots
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
        this.id = response.data.id;
        this.loadFavorites(); // Load favorite spots after getting user ID
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
    loadFavorites() {
      axios
        .get(`http://localhost:8080/favorite/user/${this.id}`)
        .then((response) => {
          this.favoriteSpots = response.data;
          this.updateMarkers(); // Update markers after loading favorites
        })
        .catch((error) => {
          console.error("Error fetching favorite spots:", error);
        });
    },
    updateMarkers() {
      this.clearMarkers();
      if (this.spots && this.spots.length > 0) {
        this.spots.forEach((spot) => {
          const isFavorite = this.favoriteSpots.some(
            (favorite) => favorite.placeId === spot.id
          );

          const marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(spot.latitude, spot.longitude),
            map: this.map,
          });

          const contentString = [
            `<div class="iw_inner">`,
            `   <h3>${spot.title}</h3>`,
            `   <p>${spot.address}<br />`,
            `       ${spot.phoneNumber} | ${spot.tag
              .split(",")
              .slice(0, 2)
              .join(", ")}<br />`,
            `       <img src="${spot.thumbnailPath}" width="300px" class="thumb" /><br />`,
            `   </p>`,
            `   <img src="/assets/img/${
              isFavorite ? "favoriteOn.png" : "favoriteOff.png"
            }" class="favorite-button" style="width: 32px; height: 32px; cursor: pointer;" />`,
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
      }
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
      if (!this.id) {
        console.error("User ID is not set.");
        alert("User information is not loaded yet.");
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
        if (confirm("Would you like to add this place to your favorites?")) {
          this.addFavorite(placeId, element);
        }
      }
    },

    addFavorite(placeId, element) {
      axios
        .post("http://localhost:8080/favorite", {
          placeId: placeId,
          userId: this.id,
        })
        .then(() => {
          alert("Added to favorites!");
          element.src = "assets/img/favoriteOn.png";
          this.loadFavorites(); // Reload favorites after adding
        })
        .catch((error) => console.error("Error adding to favorites:", error));
    },

    removeFavorite(favoriteId, element) {
      axios
        .delete(`http://localhost:8080/favorite/${favoriteId}`)
        .then(() => {
          alert("Removed from favorites!");
          element.src = "assets/img/favoriteOff.png";
          this.loadFavorites(); // Reload favorites after removing
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
.favorite-button {
  cursor: pointer;
}
</style>
