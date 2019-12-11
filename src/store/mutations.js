import state from './state';

const mutations = {
    ... (function () {
        const setters = {};

        for (let k in state) {
            const setterName = 'set' + k[0].toUpperCase() + k.slice(1);

            setters[setterName] = (state, val) => { state[k] = val };
        }

        return setters;
    })(),

    setMap(state, newMap) {
        state.map = newMap;
    },
    setActiveLocations(state, newLocations) {
        state.activeLocations = newLocations;
    },
    setUserLocation(state, newLocation) {
        state.userLocation = newLocation;
    },
    setLocations(state, newLocations) {
        state.locations = newLocations;
    },
    setRadiusDistance(state, newDistance){
        state.radiusDistance = newDistance;
    }
}

export default mutations;