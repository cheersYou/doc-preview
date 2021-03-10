/*
 * @Author: weicong
 * @Date: 2021-03-10 10:30:01
 * @LastEditTime: 2021-03-10 16:57:22
 * @LastEditors: weicong
 * @Description:
 */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/register";
import "@/style/index.scss";
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
