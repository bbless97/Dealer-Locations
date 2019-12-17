import L from "leaflet";
import Settings from "../Settings";

const actions = {
    /**
     * Sets up location markers given an array of locations
     * @param {Array} locations 
     */
    setupLocationMarkers(context, locations) {
        locations.forEach(async function (location) {
            let popupContent = null,
                latLong = [location.LocationLatitude, location.LocationLongitude];

            if (latLong) {
                popupContent = await context.dispatch('buildPopup', location, latLong);

                L.marker(latLong)
                    .addTo(context.getters.map)
                    .bindPopup(popupContent);
            }
        });
    },

    /**
     * Builds map popup, this pop up is the displayed when clicking a marker on the map
     * @param {Object} location 
     * @returns {HTML}
     */
    async buildPopup(context, location) {
        let popupContent = document.createElement("div"),
            popupLocationName = document.createElement('p'),
            popupLocation = document.createElement("p"),
            popupDirections = document.createElement("a"),
            locationAddress = await context.dispatch('getLocationAddress', location);

        popupLocationName.classList.add("pop-location-name");
        popupLocation.classList.add("pop-location");
        popupDirections.classList.add("pop-directions");

        popupLocationName.innerHTML = location.LocationName;
        popupLocation.innerHTML = locationAddress;
        popupDirections.href = await context.dispatch('getDirections', location);
        popupDirections.innerHTML = "Get Directions";
        popupDirections.target = "_blank";

        popupContent.appendChild(popupLocationName);
        popupContent.appendChild(popupLocation);
        popupContent.appendChild(popupDirections);

        return popupContent;
    },

    /**
     * Zooms in on a given location
     * @param {Object} location 
     */
    focusLocation(context, location) {
        let latLong = { lat: location.LocationLatitude, lng: location.LocationLongitude },
            map = context.getters.map;

        if (latLong) map.setView(latLong, 15);
    },

    /**
     * Get directions to a location returns URL string to google maps
     * @param {Object} toLocation 
     * @returns {String}
     */
    async getDirections(context, toLocation){
        let googleDirections = "https://www.google.com/maps/dir/";

        if(context.getters.userAddress) googleDirections += context.getters.userAddress + '/';
        if(toLocation) googleDirections += await context.dispatch('getLocationAddress', toLocation);

        return googleDirections;
    },

    /**
     * Get the address string given a location object
     * @param {Object} location 
     * @returns {String}
     */
    getLocationAddress(context, location) {
        let locationAddress = null;

        locationAddress =
            location.LocationAddress1 +
            ", " +
            location.LocationCity +
            ", " +
            location.LocationState;

        return locationAddress;
    },

    /**
     * Get the addres given an object with lat and lng
     * @param {Object} latLng 
     * @returns {Promise}
     */
    getLatLngAddress(context, latLng) {
        let mbx = require('@mapbox/mapbox-sdk'),
            mbxClient = new mbx({ accessToken: process.env.VUE_APP_MAP_BOX });

        return new Promise(function (resolve) {
            mbxClient.createRequest({
                method: 'GET',
                path: '/geocoding/v5/mapbox.places/' + latLng.lng + ',' + latLng.lat + '.json'
            }, {})
                .send()
                .then(response => {
                    // GeoJSON document with geocoding matches
                    if (response.body.features) {
                        resolve(response.body.features[0].place_name);
                    } else {
                        resolve(null);
                    }

                });
        });
    },

    /**
     * Get a location object given an address
     * @param {String} address 
     * @returns {Promise}
     */
    getLocationFromAddress(context, address) {
        let mbx = require('@mapbox/mapbox-sdk'),
            mbxClient = new mbx({ accessToken: process.env.VUE_APP_MAP_BOX });

        return new Promise(function (resolve) {
            mbxClient.createRequest({
                method: 'GET',
                path: '/geocoding/v5/mapbox.places/' + address + '.json'
            }, {})
                .send()
                .then(response => {
                    // GeoJSON document with geocoding matches
                    resolve(response.body);
                });
        });
    },

    /**
     * Get all dealer locations
     */
    getLocations() {
        return new Promise(function (resolve, reject) {
            window.ridestyler.ajax.send({
                action: "Location/List",
                callback: function (response) {
                    if (response.Success) {
                        resolve(response.Locations);
                    } else {
                        reject();
                    }
                }
            });
        });
    },

    /**
     * Get all locations nearby user's current location
     */
    async getNearbyLocations(context) {
        let locations = null,
            nearbyLocations = [],
            radiusDistance = context.getters.radiusDistance;

        locations = await context.dispatch('getLocations');

        return new Promise(function (resolve) {
            locations.forEach(async function (location) {
                if (location) {
                    let distanceAway = await context.dispatch('getDistanceAwayFromUser', location);

                    if (parseInt(distanceAway) <= radiusDistance){
                        nearbyLocations.push(location);
                        location.DistanceFromUser = distanceAway + " " + Settings.units + " away";
                    } 
                }
            });

            context.commit('setLocations', nearbyLocations);
            context.commit('setActiveLocations', nearbyLocations);

            resolve(nearbyLocations);
        });
    },

    /**
     * Get the user's location
     */
    getUserLocation(context) {
        let map = context.getters.map,
            newUserLocation = { latLng: null, marker: null };

        return new Promise(function (resolve) {
            map.locate();
            map.on("locationfound", async function (e) {
                if (context.getters.userMarkerLayer) map.removeLayer(context.getters.userMarkerLayer);

                newUserLocation.latLng = e.latlng;
                newUserLocation.marker = L.circle(newUserLocation.latLng, { radius: 200 }).addTo(map);
                newUserLocation.address = await context.dispatch('getLatLngAddress', newUserLocation.latLng);

                map.setView(newUserLocation.latLng, 10);

                context.commit('setUserLocation', newUserLocation);
                resolve();
            });
        });
    },

    /**
     * Clear all map markers
     */
    clearMapMarkers(context){
        let map = context.getters.map

        map.eachLayer(function(layer){ 
            if(layer._icon && layer._icon.classList.contains('leaflet-marker-icon') !== 0){ ///checking it's a marker and not the map
                map.removeLayer(layer);
            }
        })
    },

    /**
     * Get the distance away from a location the the user's current location
     * @param {Object} location 
     */
    async getDistanceAwayFromUser(context, location) {
        let distanceInMeters = null,
            latLng = [location.LocationLatitude, location.LocationLongitude],
            map = context.getters.map,
            distance = null;

        distanceInMeters = await map.distance(context.getters.userLatLng, latLng);

        if (Settings.options.units == 'miles') distance = await context.dispatch('convertMetersToMiles', distanceInMeters);
        else distance = distanceInMeters;

        return distance
    },

    /**
     * Convert meters to miles
     * @param {String} meters 
     * @returns {String}
     */
    async convertMetersToMiles(context, meters) {
        let metersToMiles = (meters * 0.000621).toFixed();

        return metersToMiles;
    },

    /**
     * Get Latitude and longitude array given a location object
     * @param {*} location 
     * @returns {Array} 
     */
    async getLatLong(context, location) {
        let latLng = [];

        if (location) latLng = [location.LocationLatitude, location.LocationLongitude];

        return latLng;
    },
}

export default actions;