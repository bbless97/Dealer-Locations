<template>
  <div id="side-bar-wrapper">
    <FiltersComponent v-on:filterLocation="updateLocations" />
    <ul id="location-list">
      <LocationComponent
        v-for="locationObject in activeLocations"
        v-bind:key="locationObject.LocationID"
        v-bind:location="locationObject"
        v-on:clickEvent="focusMarker"
      />
      <div id="no-results" v-if="activeLocations.length == 0">No Results</div>
    </ul>
  </div>
</template>

<script>
import LocationComponent from "../components/LocationComponent.vue";
import FiltersComponent from "../components/FiltersComponent.vue";
import { mapMutations, mapActions, mapGetters } from "vuex";
import L from "leaflet";

export default {
  name: "Locations",
  mounted() {
    var self = this;

    this.getLocations().then(function(locations) {
      self.locateUser().then(function(){
        self.setLocations(locations);
        self.setActiveLocations(locations);
        self.setupLocationMarkers(locations);
      });
    });
  },
  methods: {
    setupLocationMarkers(locations) {
      let self = this;

      locations.forEach(async function(location) {
        let popupContent = null,
        latLong = [location.LocationLatitude, location.LocationLongitude];
        
        if (latLong){
          popupContent = await self.buildPopup(location, latLong)

          L.marker(latLong)
            .addTo(self.map)
            .bindPopup(popupContent);
        }
      });
    },
    async buildPopup(location) {
      let popupContent = document.createElement("div"),
        popupLocation = document.createElement("p"),
        popupDistanceFromUser = document.createElement("p"),
        locationString = await this.getLocationString(location);

      popupLocation.classList.add("pop-location");
      popupDistanceFromUser.classList.add("pop-distance");

      popupLocation.innerHTML = locationString;
      popupDistanceFromUser.innerHTML = await this.getDistanceAwayFromUser(location) + " miles away";

      popupContent.append(popupLocation);
      popupContent.append(popupDistanceFromUser);

      return popupContent;
    },
    async focusMarker(location) {
      let latLong = await this.getLatLong(location);

      if (latLong) this.map.setView(latLong, 13);
    },
    updateLocations(locations) {
      this.setActiveLocations(locations);

      if (this.activeLocations.length == 1) {
        this.focusMarker(this.activeLocations[0]);
      }
    },
    ...mapMutations({
      setActiveLocations: "setActiveLocations",
      setLocations: "setLocations"
    }),
    ...mapActions({
      getLocations: "getLocations",
      getLocationString: "getLocationString",
      getDistanceAwayFromUser: "getDistanceAwayFromUser",
      getLatLong: "getLatLong",
      locateUser: "getUserLocation"
    })
  },
  computed: {
    ...mapGetters({
      activeLocations: "activeLocations",
      locations: "locations",
      userLocation: "userLocation",
      map: "map"
    })
  },
  components: {
    LocationComponent,
    FiltersComponent
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
#side-bar-wrapper {
  margin: 0 auto 0 40px;
  border: 1px solid lightgray;
  padding: 7px 0 0;
  width: 400px;
  overflow: hidden;
}
#location-list {
  position: relative;
  overflow: auto;
  height: 442px;
  width: 418px;
  margin: 0;
}
#no-results {
  padding: 10px 20px 0;
}
</style>
