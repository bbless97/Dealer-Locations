<template>
  <div id="mapid"></div>
</template>

<script>
import L from "leaflet";

export default {
  name: "Map",
  data() {
    return {
      map: null,
      tileLayer: null
    };
  },
  async mounted() {
    await this.initializeMap();
    this.$emit("initMap", this.map);
  },
  methods: {
    initializeMap() {
      this.map = L.map("mapid").setView([39.8283, -98.5795], 4);

      this.tileLayer = L.tileLayer(
        window.location.protocol + "//api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYmJsZXNzOTciLCJhIjoiY2sycXI2cmRoMGkzejNjcGhpOW0ybzZqbSJ9.NiFQMp12Ipvq_oznqVrMCA",
        {
          maxZoom: 18,
          id: "mapbox.streets",
          accessToken:
            "pk.eyJ1IjoiYmJsZXNzOTciLCJhIjoiY2sycXI2cmRoMGkzejNjcGhpOW0ybzZqbSJ9.NiFQMp12Ipvq_oznqVrMCA"
        }
      );

      this.tileLayer.addTo(this.map);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
