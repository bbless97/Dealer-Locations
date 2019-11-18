<template>
  <li class="location" v-on:click="onClick">
    <a>{{ location.LocationCity }}</a>
    <p>Address: {{ location.LocationAddress1 }}, {{ location.LocationCity }}, {{ location.LocationState }}</p>
    <p>Phone: {{ location.LocationSalesPhone }}</p>
  </li>
</template>

<script>
export default {
  name: "LocationComponent",
  data() {
    return {
      locationLatLong: []
    };
  },
  methods: {
    onClick() {
      this.$emit("clickEvent", this.location);
    }
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
  padding: 10px 20px 0;
  cursor: pointer;
  margin: 0 auto;

  &:hover {
    a:after {
        width: 16%;
        left: 0;
        background: #ec432c;
    }
  }

  a {
    cursor: pointer;
    color: #ec432c;
    text-transform: uppercase;

    &::after{
      content: '';
      width: 0;
      height: 2px;
      display: block;
      right: 0;
      background: #ec432c;;
      transition: width .3s ease;
      -webkit-transition: width .3s ease;
    }
  }
}
</style>
