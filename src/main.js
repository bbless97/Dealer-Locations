import Vue from 'vue';
import Store from './store/index';
import App from './App';
import Settings from './Settings';

Vue.config.productionTip = false;

/**
 * @param {HTMLElement|HTMLElement[]|string} container
 * @param {RideStylerLocationOptions} options
 */
function RideStylerLocation(container, options) {
  options = options || {};

  // Do some type checking on the container to accept, a string (CSS selector), HTML element, or array of HTML elements (such as a jQuery object)
  if (container && typeof container === 'object' && 'length' in container) {
    if (container.length > 0) container = container[0];
    else container = undefined;
  }

  // Expose $locationSettings as a property on every Vue instance
  Vue.prototype.$locationSettings = Settings;

  Settings.options = options;

  // Make sure we have a container to instantiate into
  if (!container) throw "Unable to instantiate RideStylerLocation without a container";

  this.app = new Vue({
    el: container,
    store: Store,
    render: h => h(App)
  });
}

/**
 * @param {HTMLElement|HTMLElement[]|string} container
 * @param {RideStylerLocation} options
 */
RideStylerLocation.create = function (container, options) {
  return new RideStylerLocation(container, options);
};

window.RideStylerLocation = RideStylerLocation;

