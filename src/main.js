/*
 * @Author: weicong
 * @Date: 2021-03-10 10:30:01
 * @LastEditTime: 2021-03-10 11:30:32
 * @LastEditors: weicong
 * @Description:
 */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/register";
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
