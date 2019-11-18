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

/** 
 * Callbacks to be run when the settings is done initializing
 * @type {(()=>void)[]}
 */
const settingsInitializedCallbacks = [];
let isInitialized = false;

const settings = {
    async initialize() {
        detectRideStylerEnvironment();
        
        isInitialized = true;
        settingsInitializedCallbacks.forEach(cb => cb());
        settingsInitializedCallbacks.splice(0, settingsInitializedCallbacks.length);
    },

    /**
     * @param {()=>void} callback Callback to be ran after the settings are initialized
     */
    onInitialized(callback) {
        if (isInitialized) {
            callback();
            return;
        }

        settingsInitializedCallbacks.push(callback);
    },

    /** @type {import('./main').RideStylerLocationOptions} */
    options: {},

    /** @type {RideStylerAPIEnvironment} */
    rideStylerEnvironment: undefined,
    
    units: "miles"
};

export default settings;