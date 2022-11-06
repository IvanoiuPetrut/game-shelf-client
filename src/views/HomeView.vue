<script setup lang="ts">
import GamesScroller from "../components/GamesScroller.vue";
import { useGamesTopCriticsStore } from "@/stores/games-top-critics";
import { computed, onBeforeMount } from "vue";

const store = useGamesTopCriticsStore();

const games = computed((): any => {
  return store.games;
});

onBeforeMount(() => {
  store.fetchGames();
});
</script>

<template>
  <main>
    <GamesScroller :games="games">
      <template #title> 🔝Top critically acclaimed games </template>
    </GamesScroller>
  </main>
</template>
