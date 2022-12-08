<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { onBeforeMount } from "vue";
import { useGamesTopCriticsStore } from "@/stores/games-top-critics";
import HeaderItem from "./components/HeaderItem.vue";

const store = useGamesTopCriticsStore();

onBeforeMount(() => {
  store.fetchGames();
  console.log("fetching games");
});
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <RouterLink to="/register">Register</RouterLink>
    </nav>
    <HeaderItem v-if="$route.path === '/'" />
  </header>

  <RouterView />
</template>

<style lang="scss" scoped>
@use "@/assets/style/colors.scss" as colors;

nav {
  width: 100%;
  font-size: 1.2rem;
  text-align: center;
  background-color: colors.$neutral-bg-secondary;
  padding: 1rem 0;
  margin-bottom: 1.6rem;
  @media (min-width: 768px) {
    padding: 1.6rem 0;
    margin-bottom: 3.2rem;
  }
}

nav a.router-link-exact-active {
  color: colors.$accent;
  font-weight: bold;
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid colors.$neutral-bg;
}

nav a:first-of-type {
  border: 0;
}
</style>
