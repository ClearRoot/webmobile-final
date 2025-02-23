import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import VueSimplemde from "vue-simplemde";
import "simplemde/dist/simplemde.min.css";
import "@fortawesome/fontawesome-free/css/all.css";

import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import Gravatar from "vue-gravatar";

Vue.component("v-gravatar", Gravatar);
Vue.config.productionTip = false;
Vue.prototype.$EventBus = new Vue();

Vue.use(Vuetify, {
  iconfont: "fa",
  theme: {
    primary: "#3f51b5",
    secondary: "#b0bec5",
    accent: "#8c9eff",
    error: "#b71c1c"
  }
});

Vue.use(VueSimplemde);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
