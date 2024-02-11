import { createRouter, createWebHistory } from "vue-router";
import store from "../store";
import rooms from "../views/Rooms.vue";
import room from "../views/Room.vue";
import Login from "../views/Login.vue";
import admin from "../views/Admin.vue";

const routes = [
  {
    path: "/",
    redirect: "/rooms",
  },
  {
    path: "/rooms",
    component: rooms,
  },
  {
    path: "/rooms/:name",
    component: room,
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/admin",
    component: admin,
  },
];

let timeout;

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Setup authentication guard.
const that = this;
router.beforeEach((to, from, next) => {
  clearInterval(store.state.timerID);
  console.log("clear timer")
  next();
});


export default router;
