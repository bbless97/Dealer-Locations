<template>
  <div id="app">
    <Map v-on:initMap="setMap" />
    <Locations v-if="map" />
  </div>
</template>

<script>
import Map from "./components/Map.vue";
import Locations from "./components/Locations";
import { mapMutations } from "vuex";
import Settings from "./Settings";

export default {
  name: "app",
  data() {
    return {
      map: null
    };
  },
  mounted() {
    Settings.initialize();
  },
  methods: {
    setMap(newMap) {
      if (newMap) {
        this.setMapState(newMap);
        this.map = newMap;
      }
    },
    ...mapMutations({
      setMapState: "setMap"
    })
  },
  components: {
    Map,
    Locations
  }
};
</script>

<style>
@import "https://static.ridestyler.net/rs-ui/latest/rsui-icons.min.css";

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #ec432c;
}
.icon {
  color: #ec432c;
}
.loader::after {
  content: url('https://static.ridestyler.net/images/loaders/loader_radial_chaser_back_on_white_32.gif');
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  height: inherit;
  width: 100%;
  top: 0;
}
#app {
  display: flex;
  color: #2c3e50;
}
#mapid {
  height: 100%;
  width: 100%;
  display: inline-block;
  margin: 0 0 0 auto;
  z-index: 0;
  border-radius: 5px;
}
@media screen and (max-width: 850px) {
  #app {
    flex-direction: column;
    margin-top: 0;
  }
  #mapid {
    width: 100%;
  }
  #side-bar-wrapper {
    width: 100%;
    margin: 10px 0 0;
  }
  #location-list {
    width: 110%;
  }
}
</style>
