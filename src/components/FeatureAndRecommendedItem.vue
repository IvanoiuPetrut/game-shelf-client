<script setup lang="ts">
import { computed } from "vue";
import { useGamesTopCriticsStore } from "@/stores/games-top-critics";
import BaseCarousel from "./BaseCarousel.vue";
import BaseCarouselSlide from "./BaseCarouselSlide.vue";

const store = useGamesTopCriticsStore();

const games = computed((): any => {
  return store.games;
});

const slidesNumber = computed((): number => {
  return games.value.length;
});
</script>

<template>
  <h2>Featured & Recommended</h2>
  <div class="featured">
    <BaseCarousel v-slot="{ currentSlide }" :slides="slidesNumber">
      <BaseCarouselSlide v-for="(game, index) in games" :key="game.id">
        <div v-if="currentSlide === index + 1" class="content">
          <img :src="game.background_image" alt="game.name" class="game__img" />
          <div class="game__details">
            <div class="game__header">
              <h3 class="game__name">{{ game.name }}</h3>
              <p class="game__rating">{{ game.metacritic }}</p>
            </div>
            <div class="game__details--aside">
              <div class="game__platforms">
                <p>Platforms</p>
                <div>
                  <span
                    v-for="(platform, index) in game.platforms"
                    :key="index"
                    class="game__platform"
                  >
                    {{ platform.platform.name }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BaseCarouselSlide>
    </BaseCarousel>
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/style/colors.scss" as colors;

.featured {
  margin-bottom: 50px;
}

.content {
  position: relative;
}
.game__img {
  width: 100%;
  height: 10.6rem;
  object-fit: cover;
  border-radius: 11px;

  @media (min-width: 550px) {
    height: min(45vw, 500px);
    width: min(80vw, 1000px);
  }
}

.game__header {
  display: flex;
  align-items: baseline;
  gap: 1.6rem;
}

.game__rating {
  font-size: 1.6rem;
  font-weight: 700;
  background-color: colors.$accent-transparent;
  padding: 0 0.8rem;
  border-radius: 7px;
}
.game__details {
  @media (min-width: 768px) {
    padding: 9.6rem 1.2rem 1.2rem 1.2rem;
    position: absolute;
    bottom: 0;
    width: 100%;
    border-radius: 0 0 11px 11px;

    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 4) 100%
    );
  }
}

.game__details--aside {
  display: none;
  @media (min-width: 768px) {
    display: block;
  }
}
.game__name {
  font-size: 1.8rem;
  font-weight: 700;
  color: colors.$neutral-text;
  text-align: center;
  @media (min-width: 768px) {
    text-align: start;
  }
}

.game__platforms {
  display: flex;
  align-items: baseline;
  gap: 0.8rem;
  color: colors.$neutral-text-secondary;

  p {
    font-size: 1.2rem;
    font-weight: 700;
  }

  div {
    display: flex;
    gap: 0.8rem;
  }
}
</style>
