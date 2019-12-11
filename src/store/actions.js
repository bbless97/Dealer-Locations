import L from "leaflet";
import Settings from "../Settings";

const actions = {
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
    async buildPopup(context, location) {
        let popupContent = document.createElement("div"),
            popupLocation = document.createElement("p"),
            popupDistanceFromUser = document.createElement("p"),
            locationString = await context.dispatch('getLocationString', location);

        popupLocation.classList.add("pop-location");
        popupDistanceFromUser.classList.add("pop-distance");

        popupLocation.innerHTML = locationString;
        popupDistanceFromUser.innerHTML =
            (await context.dispatch('getDistanceAwayFromUser', location)) + " miles away";

        popupContent.append(popupLocation);
        popupContent.append(popupDistanceFromUser);

        return popupContent;
    },
    focusLocation(context, location) {
        let latLong = { lat: location.LocationLatitude, lng: location.LocationLongitude },
            map = context.getters.map;

        if (latLong) map.setView(latLong, 13);
    },
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
                        location.DistanceFromUser = distanceAway + " " + Settings.units;
                    } 
                }
            });

            context.commit('setLocations', nearbyLocations);
            context.commit('setActiveLocations', nearbyLocations);

            resolve(nearbyLocations);
        });
    },
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
    setMapView(context, location, distance) {
        let map = context.getters.map;

        if (distance) map.setView(location, distance);
        else map.setView(location, 10);
    },
    clearMapMarkers(context){
        let map = context.getters.map

        map.eachLayer(function(layer){ 
            if(layer._icon && layer._icon.classList.contains('leaflet-marker-icon') !== 0){ ///checking it's a marker and not the map
                map.removeLayer(layer);
            }
        })
    },
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
    async convertMetersToMiles(context, meters) {
        let metersToMiles = (meters * 0.000621).toFixed(1);

        return metersToMiles;
    },
    async getLatLong(context, location) {
        let latLng = [];

        if (location) latLng = [location.LocationLatitude, location.LocationLongitude];

        return latLng;
    },
}

export default actions;