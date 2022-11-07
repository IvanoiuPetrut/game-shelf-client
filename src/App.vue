<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { onBeforeMount } from "vue";
import { useGamesTopCriticsStore } from "@/stores/games-top-critics";

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
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
nav {
  width: 100%;
  font-size: 1.2rem;
  text-align: center;
  background-color: #333;
  padding: 1rem 0;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
</style>
