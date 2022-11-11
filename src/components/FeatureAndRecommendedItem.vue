<script setup lang="ts">
import { computed } from "vue";
import { useGamesTopCriticsStore } from "@/stores/games-top-critics";

const store = useGamesTopCriticsStore();

const games = computed((): any => {
  return store.games;
});
</script>

<template>
  <h2>Featured & Recommended</h2>
  <div class="featured">
    <button>left</button>
    <div class="games__wrapper">
      <div v-for="game in games" :key="game.id" class="game">
        <img :src="game.background_image" alt="game.name" class="game__img" />
        <h3 class="game__name">{{ game.name }}</h3>
      </div>
    </div>
    <button>right</button>
  </div>
  <div>_ _ _ _ _ _ _</div>
</template>

<style lang="scss" scoped>
.featured {
  display: flex;
}

// .games__wrapper {
//   display: flex;
//   overflow: auto;
// }
.game {
  // &__wrapper {
  // }

  &__img {
    width: 70%;
    height: 12.8rem;
    object-fit: cover;
  }
}
</style>
