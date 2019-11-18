<template>
  <div id="app">
    <Map v-on:initMap="setMap" />
    <Locations />
  </div>
</template>

<script>
import Map from "./components/Map.vue";
import Locations from "./components/Locations";
import { mapMutations } from "vuex";
import Settings from './Settings';

export default {
  name: "app",
  data() {
    return {
      map: this.$store.getters.map
    };
  },
  mounted() {
    Settings.initialize();
  },
  methods: {
    setMap(newMap) {
      this.setMapState(newMap);
    },
    ...mapMutations({
      setMapState: 'setMap',
    }),
  },
  components: {
    Map,
    Locations
  }
};
</script>

<style>
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
  color: #42b983;
}
#app {
  display: flex;
  color: #2c3e50;
}
#mapid {
  height: 500px;
  width: 60%;
  display: inline-block;
  margin: 0 0 0 auto;
}
@media screen and (max-width: 850px){
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
