<script setup lang="ts">
import { computed } from "vue";
import { useGamesTopCriticsStore } from "@/stores/games-top-critics";
import GamesScroller from "../components/GamesScroller.vue";
import FeatureAndRecommendedItem from "@/components/FeatureAndRecommendedItem.vue";

const store = useGamesTopCriticsStore();

const games = computed((): any => {
  return store.games;
});
</script>

<template>
  <main>
    <FeatureAndRecommendedItem />
    <GamesScroller :games="games">
      <template #title> 🔝Top critically acclaimed games </template>
    </GamesScroller>
  </main>
</template>

<style lang="scss" scoped></style>
