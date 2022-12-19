<script setup lang="ts">
import { RouterView } from "vue-router";
import { onBeforeMount } from "vue";
import { useGamesTopCriticsStore } from "@/stores/games-top-critics";
import HeaderItem from "./components/HeaderItem.vue";
import BaseNav from "./components/BaseNav.vue";
import BaseFooter from "./components/BaseFooter.vue";

const store = useGamesTopCriticsStore();

onBeforeMount(() => {
  store.fetchGames();
  console.log("fetching games");
});
</script>

<template>
  <BaseNav />
  <header>
    <HeaderItem v-if="$route.path === '/'" />
  </header>

  <RouterView />
  <BaseFooter />
</template>

<style lang="scss" scoped>
@use "@/assets/style/colors.scss" as colors;
</style>
