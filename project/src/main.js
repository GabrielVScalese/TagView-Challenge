import Vue from "vue";
import App from "./App.vue";
import router from "./router";

// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHeart as solidHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-solid-svg-icons";

Vue.component("font-awesome-icon", FontAwesomeIcon);
library.add(regularHeart);
library.add(solidHeart);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
