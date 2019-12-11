const getters = {
    map(state) {
        return state.map;
    },
    activeLocations(state) {
        return state.activeLocations;
    },
    locations(state) {
        return state.locations;
    },
    userLocation(state) {
        return state.userLocation;
    },
    userLatLng(state) {
        return state.userLocation.latLng;
    },
    userMarkerLayer(state) {
        return state.userLocation.marker;
    },
    userAddress(state) {
        return state.userLocation.address;
    },
    radiusDistance(state) {
        return state.radiusDistance;
    }
}

export default getters;