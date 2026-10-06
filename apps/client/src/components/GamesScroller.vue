<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";
import type { GameBasics } from "@/types/rawg";
import HorizontalRail from "./ui/HorizontalRail.vue";
import SkeletonBlock from "./ui/SkeletonBlock.vue";
import GameCard from "./GameCard.vue";

withDefaults(
  defineProps<{
    title: string;
    subtitle?: string;
    games: GameBasics[];
    loading?: boolean;
    to?: RouteLocationRaw;
    countdown?: boolean;
  }>(),
  { loading: false },
);
</script>

<template>
  <HorizontalRail v-reveal :title="title" :subtitle="subtitle" :to="to">
    <template v-if="games.length > 0">
      <GameCard
        v-for="game in games"
        :key="game.id"
        :game="game"
        :countdown="countdown"
      />
    </template>
    <template v-else-if="loading">
      <div v-for="n in 4" :key="n">
        <SkeletonBlock height="auto" style="aspect-ratio: 16 / 10" />
        <SkeletonBlock width="40%" height="0.8rem" style="margin-top: 0.9rem" />
        <SkeletonBlock width="75%" height="1.1rem" style="margin-top: 0.5rem" />
      </div>
    </template>
  </HorizontalRail>
</template>
