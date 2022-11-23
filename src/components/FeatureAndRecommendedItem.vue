<script setup lang="ts">
import { computed } from "vue";
import { useGamesTopCriticsStore } from "@/stores/games-top-critics";
import BaseCarousel from "./BaseCarousel.vue";
import BaseCarouselSlide from "./BaseCarouselSlide.vue";

const store = useGamesTopCriticsStore();

const games = computed((): any => {
  console.log(store.games[0]);
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
        <router-link
          :to="{ name: 'gameDetails', params: { id: game.id } }"
          v-if="currentSlide === index + 1"
        >
          <div class="content">
            <img
              :src="game.background_image"
              alt="game.name"
              class="game__img"
            />
            <div class="game__details">
              <div class="game__header">
                <h3 class="game__name">{{ game.name }}</h3>
                <p class="game__rating">{{ game.metacritic }}</p>
              </div>
              <div class="game__details--aside">
                <div class="details__wrapper">
                  <p class="details__name">Platforms</p>
                  <div class="details__platforms">
                    <span
                      v-for="(platform, index) in game.platforms"
                      :key="index"
                      class="game__platform"
                    >
                      {{ platform.platform.name }}
                    </span>
                  </div>
                </div>
                <div class="details--hiden">
                  <div class="details__wrapper">
                    <p class="details__name">Released</p>
                    <p>{{ game.released }}</p>
                  </div>
                  <div class="details__wrapper">
                    <p class="details__name">Length</p>
                    <p>{{ game.playtime }} hours</p>
                  </div>
                  <div class="screenshots__wrapper">
                    <div
                      v-for="(screenshot, index) in game.short_screenshots"
                      :key="screenshot.id"
                    >
                      <img
                        v-if="index > 1 && index < 5"
                        :src="screenshot.image"
                        alt="game.name"
                        class="screenshot"
                        width="200"
                        height="150"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </router-link>
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
  cursor: pointer;
  overflow: hidden;
  border-radius: 11px;

  &:hover {
    .game__img {
      transition: all 0.3s ease-in-out;
      transform: scale(1.1);
      filter: blur(3pFx);
    }
    .game__details {
      transform: translateY(0);
    }
  }
}

.game__img {
  width: 100%;
  height: 10.6rem;
  object-fit: cover;
  border-radius: 11px;
  transform: scale(1.05);

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
  color: colors.$neutral-text;
  background-color: colors.$accent-transparent;
  padding: 0 0.8rem;
  border-radius: 7px;
}
.game__details {
  @media (min-width: 768px) {
    padding: 1.2rem;
    position: absolute;
    bottom: 0;
    height: 70%;
    width: 100%;
    border-radius: 0 0 11px 11px;
    transition: all 0.3s ease-in-out;
    transform: translateY(71%);
    // background: linear-gradient(
    //   180deg,
    //   rgba(0, 0, 0, 0) 0%,
    //   rgba(0, 0, 0, 4) 50%
    // );
    background: colors.$neutral-gradient;
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

.details__wrapper {
  display: flex;
  align-items: baseline;
  gap: 0.8rem;
  color: colors.$neutral-text-secondary;
}

.details__platforms {
  display: flex;
  gap: 0.8rem;
}

.details__name {
  color: colors.$neutral-text-secondary;
  font-size: 1.2rem;
  font-weight: 700;
}

.screenshots__wrapper {
  display: flex;
  justify-content: center;
  gap: 0.8rem;
  margin-top: 1.6rem;

  .screenshot {
    border-radius: 7px;
    object-fit: cover;
    width: min(20vw, 200px);
  }

  // @media (min-width: 768px) {
  //   display: block;
  // }
}
</style>
