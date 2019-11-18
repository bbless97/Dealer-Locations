import L from "leaflet";
import Settings from "../Settings";

const actions = {
    getLocationString(context, location) {
        let locationString = null;

        locationString =
            location.LocationAddress1 +
            ", " +
            location.LocationCity +
            ", " +
            location.LocationState;

        return locationString;
    },
    getLocations(context) {
        return new Promise(function (resolve, reject) {
            window.ridestyler.ajax.send({
                action: "Location/List",
                callback: function (response) {
                    if (response.Success) {
                        context.commit('setLocations', response.locations);
                        resolve(response.Locations);
                    } else {
                        reject();
                    }
                }
            });
        });
    },
    getUserLocation(context) {
        let map = context.getters.map;
        
        return new Promise(function(resolve){
            map.locate();
            map.on("locationfound", function (e) {
                context.commit('setUserLocation', e.latlng);
                L.circle(e.latlng, {radius: 200}).addTo(map);
                resolve();
            });
        });
    },
    async getDistanceAwayFromUser(context, location) {
        let distanceInMeters = null,
            latLng = [location.LocationLatitude, location.LocationLongitude],
            map = context.getters.map,
            distance = null;

        distanceInMeters = await map.distance(context.getters.userLocation, latLng);

        if(Settings.options.units == 'miles') distance = await context.dispatch('convertMetersToMiles', distanceInMeters);
        else distance = distanceInMeters;

        return distance
    },
    async convertMetersToMiles(context, meters){
        let metersToMiles = (meters * 0.000621).toFixed(1);

        return metersToMiles;
    },
    async getLatLong(context, location) {
        let latLng = [];

        if(location) latLng = [location.LocationLatitude, location.LocationLongitude];

        return latLng;
    },
}

export default actions;