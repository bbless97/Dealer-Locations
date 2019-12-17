<template>
  <div id="location-filters">
    <div id="location-current-location">
      <input
        type="search"
        id="location-search-input"
        v-on:input="createNewUserLocation"
        :placeholder="userAddress || 'Enter Your Location'"
        :value="userAddress"
      />
    </div>
    <div id="location-filter-bar">
      <div id="filter-max-distance-wrapper">
        <span>Max:</span>
        <input id="filter-max-distance" v-on:input="compileActiveFilters" v-model="maxDistance" />
        <span>{{ unitsAbr }}</span>
      </div>
      <div id="locate-user">
        <i class="icon icon-street-view" v-on:click="getUserLocation" alt="Get Your Current Location"></i>
      </div>
    </div>
  </div>
</template>

<script>
import settings from '../Settings';
import { mapGetters, mapActions, mapMutations } from "vuex";
import L from "leaflet";

export default {
  name: "FiltersComponent",
  data() {
    return {
      isOrdered: false,
      searchTimeout: undefined,
      maxDistance: this.$store.state.radiusDistance,
      filters: [],
      isLoading: false
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
    createNewUserLocation(e) {
      let self = this,
        address = e.target.value,
        newUserLocation = {},
        newLatLng = { lat: null, lng: null };

      if (this.searchTimeout) clearTimeout(this.searchTimeout);

      if (address) {
        this.isLoading = true;
        this.searchTimeout = setTimeout(function() {
          self.getLocationFromAddress(address).then(function(location) {
            if (location && location.features[0]) {
              newLatLng.lat = location.features[0].center[1];
              newLatLng.lng = location.features[0].center[0];
              newUserLocation.latLng = newLatLng;
              newUserLocation.address = address;

              if(self.userLocation.marker) self.map.removeLayer(self.userLocation.marker); ///remove current marker if applicable
              newUserLocation.marker = L.circle(newUserLocation.latLng, { radius: 200 });
              newUserLocation.marker.addTo(self.map);
              self.map.setView(newUserLocation.latLng, 10);

              self.setUserLocation(newUserLocation);
            }
            self.isLoading = false;
          });
        }, 1500);
      }
    },
    getKeywordLocations(locations) {
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
    async getLocationsWithNewDistance() {
      let newLocations = null;

      this.setRadiusDistance(this.maxDistance);

      newLocations = await this.getNearbyLocations();

      return newLocations;
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
    async compileActiveFilters() {
      let filteredLocations = this.locations;
      
      if (this.maxDistance) 
        filteredLocations = this.getLocationsWithNewDistance();

      this.$emit("filterLocation", filteredLocations);
    },
    ...mapActions({
      getLocationFromAddress: "getLocationFromAddress",
      getNearbyLocations: "getNearbyLocations",
      getUserLocation: "getUserLocation"
    }),
    ...mapMutations({
      setUserLocation: "setUserLocation",
      setRadiusDistance: "setRadiusDistance"
    })
  },
  computed: {
    ...mapGetters({
      locations: "locations",
      map: "map",
      userLocation: "userLocation",
      userAddress: "userAddress"
    }),
    unitsAbr() {
      if(settings.units == "miles"){
        return "mi."
      } else {
        return "km."
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
#location-filters {
  width: auto;
  margin: 0 auto;
  padding: 0 5% 2%;
}
#location-filter-bar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 5px auto 0;
  .icon {
    cursor: pointer;
  }
  .locate-user {
    margin-right: 7px;
  }
}
#location-search-input {
  width: 98%;
  height: 25px;
  margin: 0 auto;
  padding: 0 0 0 2%;
  border-right: none;
  border-left: none;
  border-top: none;
  border-bottom: 1px solid lightgray;
}
#location-current-location{
  span {
    position: relative;
    float: right;
    right: 18px;
    width: 9px;
    height: 36px;
    cursor: pointer;
    bottom: 27px;
  }
}
#filter-max-distance-wrapper {
  display: inline-block;
  width: auto;
  max-width: 37%;
}
#filter-max-distance {
  width: 31%;
  height: 13px;
  vertical-align: text-top;
  margin: 0 5px;
  border-right: none;
  border-left: none;
  border-top: none;
  text-align: center;
  border-bottom: 1px solid lightgray;
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
    border-bottom: 1px solid rgba(0,0,0,0);
  }
}
</style>
