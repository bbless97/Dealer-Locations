import Vue from 'vue';
import Vuex from 'vuex';

import state from './state';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';

Vue.use(Vuex);

/** @typedef {import('./state').RidesStylerLocationState} RidesStylerLocationState */
/** @typedef {import('../../node_modules/vuex/types/index').Store<RidesStylerLocationState>} RidesStylerLocationStore */

/** @type {RidesStylerLocationStore} */
const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
});

export default store;
