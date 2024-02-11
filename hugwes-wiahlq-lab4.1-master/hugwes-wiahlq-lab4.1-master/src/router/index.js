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
router.beforeEach((to, from, next) => {
  // const regex = new RegExp("/room", "g");
  const regex = /room/g;
  // console.log(regex + "här är vi");
  if (store.state.authenticated || to.path === "/login") {
    console.log("login, eller har loggat in")
    next();
    clearTimeout(timeout);
    console.log("timern har avbrutits")
  } else if (regex.test(to.path)){
    next();
    if (Object.keys(to.params).length === 0){
      clearTimeout(timeout);
      console.log("timern har avbrutits")
    }
    else{
      timeout = setTimeout(() =>{
        console.log("timern gick ut, skickar tillbaka till rooms")
        router.push(`/rooms`);
      }, 10000);
      console.log("Timern har startat")
    }
    console.log("inne i room")
  }  else {
    console.log("inte inloggad")
    clearTimeout(timeout);
    console.log("timern har avbrutits")
    // vi ska inte alltid till login fixa
    console.info("Unauthenticated user. Redirecting to login page.");
    next("/login");
  }
});

export default router;
