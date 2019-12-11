<template>
  <div id="map-wrapper">
    <input id="search-location" placeholder="Enter Location" v-on:input="searchLocation($event)" />
    <div id="mapid"></div>
  </div>
</template>

<script>
import L from "leaflet";
import { mapGetters, mapActions } from "vuex";

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
        window.location.protocol +
          "//api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=" +
          process.env.VUE_APP_MAP_BOX,
        {
          maxZoom: 18,
          id: "mapbox.streets",
          accessToken: process.env.VUE_APP_MAP_BOX
        }
      );

      this.tileLayer.addTo(this.map);
    },
    searchLocation(input) {
      let keyword = input.target.value; 

      for(let location in this.locations){
        let address = this.locations[location].LocationAddress1 + ", " + this.locations[location].LocationCity + ", " + this.locations[location].LocationState;

        if(address.indexOf(keyword) != -1){
          this.focusLocation(this.locations[location]);
        }
      }
    },
    ...mapActions({
      focusLocation: "focusLocation",
    })
  },
  computed: {
    ...mapGetters({
      locations: "locations",
    }),
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  #search-location {
    position: absolute;
    z-index: 1;
    width: 250px;
    height: 25px;
    top: 10px;
    right: 10px;
    padding-left: 10px;
    border-radius: 5px;
    box-shadow: 0px 1px 6px rgba(0,0,0,0.5);
    border: 1px solid lightgray;
  }
  #map-wrapper {
    width: 60%;
    height: 500px;
    position: relative;
  }
</style>
