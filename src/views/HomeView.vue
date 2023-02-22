<script setup lang="ts">
import { computed } from "vue";
import { useGamesTopCriticsStore } from "@/stores/games-top-critics";
import { useGamesMostPopularStore } from "@/stores/games-most-popular";
import GamesScroller from "../components/GamesScroller.vue";
import FeatureAndRecommendedItem from "@/components/FeatureAndRecommendedItem.vue";
import GameCategories from "../components/GameCategories.vue";

const gamesTopCriticsStore = useGamesTopCriticsStore();
const gamesGamesMostPopularStore = useGamesMostPopularStore();

const gamesTopCriticsGames = computed((): any => {
  return gamesTopCriticsStore.games;
});

const gamesGamesMostPopularGames = computed((): any => {
  return gamesGamesMostPopularStore.games;
});
</script>

<template>
  <main>
    <FeatureAndRecommendedItem />
    <GamesScroller :games="gamesTopCriticsGames">
      <template #title> Critically acclaimed games </template>
    </GamesScroller>
    <GamesScroller :games="gamesGamesMostPopularGames">
      <template #title> Most popular games </template>
    </GamesScroller>
    <GameCategories />
  </main>
</template>

<style lang="scss" scoped></style>
