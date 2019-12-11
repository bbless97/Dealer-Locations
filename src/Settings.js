import store from './store/index';

function detectRideStylerEnvironment() {
    const url = window.ridestyler.ajax.url('', undefined);

    if (/\/api-alpha\./i.test(url)) settings.rideStylerEnvironment = 'alpha';
    else if (/\/api-beta\./i.test(url)) settings.rideStylerEnvironment = 'beta';
    else if (/\/api\./i.test(url)) settings.rideStylerEnvironment = 'live';
    else settings.rideStylerEnvironment = 'other';
}

/**
 * @typedef {'live'|'beta'|'alpha'|'other'} RideStylerAPIEnvironment
 */


const settings = {
    async initialize() {
        detectRideStylerEnvironment();
        
        for(let setting in this.options){
            if(store.state[setting] != null){
                store.state[setting] = this.options[setting];
            }
        }
    },
    
    /** @type {import('./main').RideStylerLocationOptions} */
    options: {},

    /** @type {RideStylerAPIEnvironment} */
    rideStylerEnvironment: undefined,
    
    units: "miles",

    radiusDistance: null,
};

export default settings;