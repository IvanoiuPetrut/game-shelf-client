import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import GameDetails from "../views/GameDetails.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/games/:id",
      name: "gameDetails",
      component: GameDetails,
      props: true,
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/RegisterView.vue"),
    },
    {
      path: "/games/categories/:category",
      name: "category",
      component: () => import("../views/CategoryView.vue"),
      props: true,
    },
    {
      path: "/developer/:developer",
      name: "developer",
      component: () => import("../views/DeveloperView.vue"),
      props: true,
    },
    {
      path: "/publisher/:publisher",
      name: "publisher",
      component: () => import("../views/PublisherView.vue"),
      props: true,
    },
  ],
});

export default router;
