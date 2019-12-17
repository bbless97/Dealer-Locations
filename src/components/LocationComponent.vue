<template>
  <li class="location" v-on:click="onClick($event)">
    <a id="location-name">{{ location.LocationCity }}</a>
    <p><i class="icon icon-map-marker-alt"></i>{{ location.LocationAddress1 }}, {{ location.LocationCity }}, {{ location.LocationState }}</p>
    <p><i class="icon icon-phone-alt"></i>{{ location.LocationSalesPhone }}</p>
    <p><a :href="directions" target="_blank">Get Directions</a><span><i class="icon icon-route"></i>{{ location.DistanceFromUser }}</span></p>
  </li>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: "LocationComponent",
  data() {
    return {
      locationLatLong: [],
      directions: ''
    };
  },
  mounted(){
    this.getDirections(this.location).then((googleDirections) => {
      if(googleDirections) this.directions = googleDirections;
    });
  },
  methods: {
    onClick(e) {
      let locationEl = null,
          activeLocations = document.getElementsByClassName('active');

      if(e.target.classList.contains('location')) locationEl = e.target;
      else locationEl = e.target.parentElement;

      if(activeLocations.length) {
        activeLocations.forEach(function(element){
          if(element != locationEl) element.classList.remove('active');
        });
      }

      if(!locationEl.classList.contains('active')) locationEl.classList.add('active');

      this.$emit("clickEvent", this.location);
    },
    ...mapActions({
      getDirections: 'getDirections'
    })
  },
  props: {
    location: Object
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.location {
  display: block;
  text-align: left;
  border-bottom: 1px solid lightgrey;
  padding: 10px 20px;
  cursor: pointer;
  margin: 0 auto;

  p {
    color: gray;
  }

  p:last-child {
    margin-bottom: 0;

    span {
      float: right;
    }
  }

  &.active {
    -webkit-transition: all .3s ease-in-out;
    transition: all .1s ease-in-out;
    border-left: 3px solid #ec432c;
  }

  #location-name {
    cursor: pointer;
    text-transform: uppercase;
    color: black;
    font-weight: bold;

    &::after{
      content: '';
      width: 0;
      height: 2px;
      display: block;
      right: 0;
      background: #ec432c;
      transition: width .3s ease;
      -webkit-transition: width .3s ease;
    }
  }
  .icon {
    margin-right: 10px;
    vertical-align: middle;
  }
}
</style>
