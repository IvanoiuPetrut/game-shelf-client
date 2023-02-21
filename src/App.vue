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
