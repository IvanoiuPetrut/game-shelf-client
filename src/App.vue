<script setup lang="ts">
import { RouterView } from "vue-router";
import { onBeforeMount } from "vue";
import { useGamesTopCriticsStore } from "@/stores/games-top-critics";
import { useGamesMostPopularStore } from "@/stores/games-most-popular";
import { useGamesRandomStore } from "@/stores/games-random";
import HeaderItem from "./components/HeaderItem.vue";
import BaseNav from "./components/BaseNav.vue";
import BaseFooter from "./components/BaseFooter.vue";

const gamesTopCriticsStore = useGamesTopCriticsStore();
const gamesGamesMostPopularStore = useGamesMostPopularStore();
const gamesRandomStore = useGamesRandomStore();

onBeforeMount(() => {
  gamesTopCriticsStore.fetchGames();
  gamesGamesMostPopularStore.fetchGames();
  gamesRandomStore.fetchGames();
});
</script>

<template>
  <BaseNav class="navigation" />
  <HeaderItem v-if="$route.path === '/'" />

  <RouterView />
  <BaseFooter />
</template>

<style lang="scss" scoped>
@use "@/assets/style/colors.scss" as colors;

.navigation {
  margin-bottom: 3.2rem;
}
</style>
