import Vue from 'vue'
import App from './App.vue'
import {router} from "./router";
import VueResource from 'vue-resource';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import {BootstrapVue, IconsPlugin} from "bootstrap-vue";
import Notifications from 'vue-notification';

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

Vue.use(Notifications);

Vue.use(VueResource);
Vue.http.options.root = process.env.VUE_APP_API_HOST;

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
