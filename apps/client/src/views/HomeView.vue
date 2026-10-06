<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useGamesTopCriticsStore } from "@/stores/games-top-critics";
import { useGamesMostPopularStore } from "@/stores/games-most-popular";
import { useGamesRandomStore } from "@/stores/games-random";
import { useGamesUpcomingStore } from "@/stores/games-upcoming";
import { useShelfStore } from "@/stores/shelf";
import HeaderItem from "@/components/HeaderItem.vue";
import FeatureAndRecommendedItem from "@/components/FeatureAndRecommendedItem.vue";
import GamesScroller from "@/components/GamesScroller.vue";
import SurpriseTeaser from "@/components/SurpriseTeaser.vue";
import GameCategories from "@/components/GameCategories.vue";

const topCritics = useGamesTopCriticsStore();
const mostPopular = useGamesMostPopularStore();
const random = useGamesRandomStore();
const upcoming = useGamesUpcomingStore();
const shelf = useShelfStore();

const playing = computed(() => shelf.byStatus("playing"));

onMounted(() => {
  random.fetchGames();
  topCritics.fetchGames();
  upcoming.fetchGames();
  mostPopular.fetchGames();
});
</script>

<template>
  <main>
    <HeaderItem />
    <FeatureAndRecommendedItem />
    <GamesScroller
      v-if="playing.length > 0"
      title="Continue playing"
      subtitle="Games on your shelf you're playing right now"
      :games="playing"
      :to="{ name: 'shelf', query: { status: 'playing' } }"
    />
    <GamesScroller
      title="Critically acclaimed"
      subtitle="The best-reviewed games of the last five years"
      :games="topCritics.games"
      :loading="topCritics.loading"
      :to="{
        name: 'category',
        params: { category: 'all' },
        query: { ordering: '-metacritic' },
      }"
    />
    <GamesScroller
      title="Coming soon"
      subtitle="The most anticipated games of the next three months"
      :games="upcoming.games"
      :loading="upcoming.loading"
      :to="{ name: 'upcoming' }"
      countdown
    />
    <SurpriseTeaser />
    <GamesScroller
      title="Trending this year"
      subtitle="What players have been adding to their libraries"
      :games="mostPopular.games"
      :loading="mostPopular.loading"
      :to="{
        name: 'category',
        params: { category: 'all' },
        query: { ordering: '-added' },
      }"
    />
    <GameCategories />
  </main>
</template>
