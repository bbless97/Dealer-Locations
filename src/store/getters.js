const getters = {
    map(state){
        return state.map;
    },
    activeLocations(state) {
        return state.activeLocations;
    },
    locations(state){
        return state.locations;
    },
    userLocation(state){
        return state.userLocation;
    }
}

export default getters;