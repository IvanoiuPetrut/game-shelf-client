import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import GameDetails from "../views/GameDetails.vue";
import { useBackdropStore } from "@/stores/backdrop";

declare module "vue-router" {
  interface RouteMeta {
    title?: string;
  }
}

const PAGE_TRANSITION_MS = 180;

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
      meta: { title: "About" },
    },
    {
      path: "/games/:id",
      name: "gameDetails",
      component: GameDetails,
      props: true,
    },
    {
      path: "/games/categories/:category",
      name: "category",
      component: () => import("../views/CategoryView.vue"),
      props: true,
      meta: { title: "Browse" },
    },
    {
      path: "/upcoming",
      name: "upcoming",
      component: () => import("../views/UpcomingView.vue"),
      meta: { title: "Upcoming releases" },
    },
    {
      path: "/surprise",
      name: "surprise",
      component: () => import("../views/SurpriseView.vue"),
      meta: { title: "Surprise me" },
    },
    {
      path: "/shelf",
      name: "shelf",
      component: () => import("../views/ShelfView.vue"),
      meta: { title: "My Shelf" },
    },
    {
      path: "/developer/:developer",
      name: "developer",
      component: () => import("../views/CompanyView.vue"),
      props: (route) => ({ kind: "developer", id: route.params.developer }),
    },
    {
      path: "/publisher/:publisher",
      name: "publisher",
      component: () => import("../views/CompanyView.vue"),
      props: (route) => ({ kind: "publisher", id: route.params.publisher }),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "notFound",
      component: () => import("../views/NotFoundView.vue"),
      meta: { title: "Not found" },
    },
  ],
  // Wait for the outgoing page to fade out before jumping to the top
  scrollBehavior(to, from, savedPosition) {
    if (to.path === from.path) return;
    return new Promise((resolve) => {
      setTimeout(
        () => resolve(savedPosition ?? { top: 0 }),
        PAGE_TRANSITION_MS,
      );
    });
  },
});

router.beforeEach((to, from) => {
  // Each page sets its own backdrop art; clear the previous page's
  if (to.path !== from.path) useBackdropStore().set(null);
});

router.afterEach((to) => {
  document.title = to.meta.title
    ? `${to.meta.title} · Game Shelf`
    : "Game Shelf";
});

export default router;
