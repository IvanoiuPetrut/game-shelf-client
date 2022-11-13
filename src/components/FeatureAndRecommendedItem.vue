<script setup lang="ts">
import { computed } from "vue";
import { useGamesTopCriticsStore } from "@/stores/games-top-critics";
import BaseCarousel from "./BaseCarousel.vue";
import BaseCarouselSlide from "./BaseCarouselSlide.vue";

const store = useGamesTopCriticsStore();

const games = computed((): any => {
  return store.games;
});
</script>

<template>
  <h2>Featured & Recommended</h2>
  <div class="featured">
    <BaseCarousel class="carousel" v-slot="{ currentSlide }">
      <BaseCarouselSlide
        v-for="(game, index) in games"
        :key="game.id"
        class="carousel__slide"
      >
        <div v-show="currentSlide === index + 1">
          <img :src="game.background_image" alt="game.name" class="game__img" />
          <h3 class="game__name">{{ game.name }}</h3>
        </div>
      </BaseCarouselSlide>
    </BaseCarousel>
  </div>
</template>

<style lang="scss" scoped>
.featured {
  margin-bottom: 350px;
}
.carousel {
  .carousel__slide {
    display: flex;
    flex-direction: column;
    align-items: center;

    // position: absolute;
    // top: 0px;
    // left: 50%;
    // transform: translateX(-50%);
  }
}
.game__img {
  width: 80vw;
  height: 15.6rem;
  object-fit: cover;
}
</style>
