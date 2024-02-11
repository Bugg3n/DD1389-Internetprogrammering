import { createRouter, createWebHistory } from "vue-router";
import store from "../store";
import room from "../views/Room.vue";
import Login from "../views/Login.vue";
import admin from "../views/Admin.vue";
import register from "../views/Register.vue";
import game from "../views/Game.vue";
import matchHistory from "../views/matchHistory.vue";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  
  {
    path: "/register",
    component: register,
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
  {
    path: "/game/:gameid/:name",
    component: game
  },
  {
    path: "/matchHistory",
    component: matchHistory
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Setup authentication guard.
router.beforeEach(async (to, from, next) => {
  // clearInterval(store.state.timerID);
  console.log("vi är i router" + from.path)
  if (to.path === "/tryLogin" || to.path === "/tryRegister") {
    //console.log("to path = /login");

    try {
      const response = await fetch("/api/checkLogin");
      const data = await response.json();
      const loggedIn = data.loggedIn;
      console.log("logged in: " + loggedIn);

      if (loggedIn) {
        console.log("Vi är inloggade");
        //router.push("/admin");
      } else {
        if (to.path === "/tryLogin"){
        //console.log("Vi är inte inloggade, går till login");
        router.push("/login");
        }else{
          router.push("/register");
        }

      }
    } catch (error) {
      console.log("An error occurred while checking login status:", error);
      next();
    }
  } else {
    console.log("Går till annat");
    next();
  }
});


export default router;
