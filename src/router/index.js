/*
 * @Author: weicong
 * @Date: 2021-03-10 10:30:02
 * @LastEditTime: 2021-03-10 16:49:33
 * @LastEditors: weicong
 * @Description:
 */
import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
