<template>
  <div id="location-filters">
    <div id="location-current-location">
      <input type="text" id="location-search-input" v-on:input="updateCurrentLocation" placeholder="Current Location"/>
    </div>
    <div id="location-search-filter">
      <input type="text" id="location-search-input" v-on:input="compileActiveFilters" placeholder="Search for location" v-model="searchInput"/>
    </div>
    <div id="location-filter-bar">
      <span id="filter-order" name="isOrdered" class="filter" v-on:click="toggleFilter">Order</span>
      <span id="filter-clear" class="filter" v-on:click="clearFilters">Clear Filters</span>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  name: "FiltersComponent",
  data() {
    return {
      isOrdered: false,
      searchInput: undefined,
      filters: []
    };
  },
  methods: {
    toggleFilter(e) {
      let el = e.target,
        filter = el.attributes.name.value;

      if (this[filter]) {
        el.classList.remove("active-filter");
        this[filter] = false;
      } else {
        el.classList.add("active-filter");
        this[filter] = true;
      }

      this.compileActiveFilters();
    },
    updateCurrentLocation(e) {
      let location = e.target.value;

      this.setUserLocation(location);
    },
    search(locations) {
      let input = this.searchInput.toLowerCase();
      
      return locations.filter(function(location) {
          let locationAddress =
            location.LocationAddress1.toLowerCase() +
            ", " +
            location.LocationCity.toLowerCase() +
            ", " +
            location.LocationState.toLowerCase();

          return locationAddress.includes(input);
        });
    },
    getOrderedLocations(locations) {
      let orderedLocations = [];

      locations.forEach(function(location) {
        orderedLocations.push(location);
      });

      return orderedLocations.sort((a, b) =>
        a.LocationCity > b.LocationCity ? 1 : -1
      );
    },
    getNearbyLocations(locations) {
      var self = this,
        nearbyLocations = [];

      return new Promise(function(resolve) {
        locations.forEach(async function(location) {
          if (location) {
            let distanceAway = await self.getDistanceAwayFromUser(location);

            if (parseInt(distanceAway) < 1500) nearbyLocations.push(location);
          }
        });

        resolve(nearbyLocations);
      });
    },
    async compileActiveFilters() {
      let filteredLocations = this.locations;

      if(this.searchInput) filteredLocations = this.search(filteredLocations);
      if(this.isOrdered) filteredLocations = this.getOrderedLocations(filteredLocations);
      if(this.isNearby) filteredLocations = await this.getNearbyLocations(filteredLocations);

      this.$emit("filterLocation", filteredLocations);
    },
    clearFilters() {
      let orderElement = document.getElementById("filter-order"),
        radiusElement = document.getElementById("filter-radius");

      this.isOrdered = false;
      orderElement.classList.remove("active-filter");
      this.isNearby = false;
      radiusElement.classList.remove("active-filter");
      this.searchInput = "";

      this.$emit("filterLocation", this.locations);
    },
    ...mapActions({
      getDistanceAwayFromUser: "getDistanceAwayFromUser"
    }),
    ...mapMutations({
      setUserLocation: "setUserLocation"
    })
  },
  computed: {
    ...mapGetters({
      activeLocations: "activeLocations",
      locations: "locations",
      userLocation: "userLocation",
      map: "map"
    })
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
#location-filters {
  width: 97%;
  margin: 0 auto;
}
#location-filter-bar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
#location-search-filter {
  margin-bottom: 5px;
}
#location-search-input {
  width: 99%;
  margin: 0 auto;
  padding: 0 1%;
}
.filter {
  margin: 0 5px;
  padding-bottom: 2px;
  border-bottom: 1px solid rgba(0, 0, 0, 0);
  cursor: pointer;

  &:hover {
    border-bottom: 1px solid black;
  }
}
.active-filter {
  border-bottom: 1px solid black;
}
#filter-radius {
  margin-right: auto;
}
#filter-clear {
  color: #ec432c;

  &:hover {
    border-bottom: 1px solid #ec432c;
  }
}
</style>
