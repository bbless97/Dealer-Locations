<template>
  <div id="side-bar-wrapper">
    <FiltersComponent v-on:filterLocation="updateLocations"/>
    <ul id="location-list" v-bind:class="{ loader: isLoading }">
      <LocationComponent
        v-for="locationObject in activeLocations"
        v-bind:key="locationObject.LocationID"
        v-bind:location="locationObject"
        v-on:clickEvent="focusLocation"
      />
      <div id="no-results" v-if="activeLocations.length == 0">No Results</div>
    </ul>
  </div>
</template>

<script>
import LocationComponent from "../components/LocationComponent.vue";
import FiltersComponent from "../components/FiltersComponent.vue";
import { mapMutations, mapActions, mapGetters } from "vuex";

export default {
  name: "Locations",
  data: function() {
    return {
      isLoading: false
    }
  },
  mounted() {
    var self = this;

    this.locateUser()
      .then(function() {
        self.updateMap();
      })
      .catch(function() {});
  },
  methods: {
    async updateLocations(locations) {
      this.isLoading = true;
      await this.setActiveLocations(locations);
      this.isLoading = false;

      if (this.activeLocations.length == 1) {
        this.focusLocation(this.activeLocations[0]);
      }
    },
    ...mapMutations({
      setActiveLocations: "setActiveLocations"
    }),
    ...mapActions({
      locateUser: "getUserLocation",
      focusLocation: "focusLocation",
      getNearbyLocations: "getNearbyLocations",
      setupLocationMarkers: "setupLocationMarkers",
      clearMapMarkers: "clearMapMarkers"
    })
  },
  computed: {
    ...mapGetters({
      activeLocations: "activeLocations",
      locations: "locations",
      userLocation: "userLocation",
    })
  },
  watch: {
    userLocation(){
      this.getNearbyLocations();
    },
    locations(newLocations){
      this.clearMapMarkers();
      this.setupLocationMarkers(newLocations);
    }
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
  margin: 0 auto 0 15px;
  border: 1px solid lightgray;
  border-radius: 5px;
  padding: 7px 0 0;
  width: 400px;
  overflow: hidden;
}
#location-list {
  position: relative;
  overflow: auto;
  height: 431px;
  width: 418px;
  margin: 0;
  border-top: 1px solid lightgray;

  li {
    margin-right: 17px;
    &:last-child {
      border-bottom: none;
    }
  }
}
#no-results {
  padding: 10px 20px 0;
}
</style>
