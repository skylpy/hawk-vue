// JS polyfill
// import "@babel/polyfill";
import VConsole from 'vconsole';
if (CONFIG.vConsole) {
  var vConsole = new VConsole();
}

// 初始化融云
window.RongIMLib = require('../src/lib/rongcloud/RongIMLib-2.3.5.min');
window.RongIMClient = window.RongIMLib.RongIMClient
window.RongIMLib.RongIMEmoji = require('../src/lib/rongcloud/RongEmoji-2.2.7');

require('./lib/jquery')

// Import Vue
import Vue from 'vue';

// Import Framework7
import Framework7 from 'framework7/framework7.esm.bundle.js';

// Import Framework7 Vue
import Framework7Vue from 'framework7-vue/framework7-vue.esm.bundle.js';

// Import F7 Style
import Framework7CSS from 'framework7/css/framework7.css';

// Import F7 iOS Icons
import Framework7Icons from 'framework7-icons/css/framework7-icons.css';

// Import Material Icons
import MaterialIcons from 'material-design-icons/iconfont/material-icons.css';

// Import Fontawesome Theme Styles
import FontAwesome from 'font-awesome/css/font-awesome.css';

// Import App Custom Styles
import AppStyles from 'assets/sass/hawk.scss'

import "vodal/common.css";
import "vodal/rotate.css";

// import axios
import axios from 'axios';

axios.defaults.baseURL = CONFIG.server.url;
axios.defaults.timeout = 10000

// Import App Component
import app from './main.vue';

// Import Vuex Storage
import store from './store';

// Different F7-Vue plugin initialization with f7 v3.0
Framework7.use(Framework7Vue);

import VueClipboard from 'vue-clipboard2';
Vue.use(VueClipboard);

// Init Vue App
export default new Vue({
  // Root Element
  el: '#app',
  store,
  render: c => c('app'),
  components: {
    app
  }
});
