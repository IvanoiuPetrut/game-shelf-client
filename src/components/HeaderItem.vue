<script setup lang="ts">
import { computed } from "vue";
import { useGamesTopCriticsStore } from "@/stores/games-top-critics";
import BaseButton from "./BaseButton.vue";

const store = useGamesTopCriticsStore();

const games = computed((): any => {
  return store.games;
});
</script>

<template>
  <section class="hero">
    <div class="hero__section--description">
      <h1 class="hero__title">Game Shelf</h1>
      <p class="hero__description">
        Social environment for gamers to share their thoughts on games, keep
        track of their <strong>gamer's journey</strong>, find new games to play,
        and more.
      </p>
      <RouterLink to="/register">
        <BaseButton>
          <template #text> Sign Up for Free </template>
        </BaseButton>
      </RouterLink>
    </div>
    <div class="hero__section--img">
      <div class="bookshelf">
        <div class="bookshelf__shelf"></div>
        <div class="game__wrapper">
          <div class="bookshelf__game"></div>
          <div class="bookshelf__game"></div>
          <div class="bookshelf__game"></div>
          <div class="bookshelf__game"></div>
        </div>
        <div class="bookshelf__game bookshelf__game--big"></div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use "@/assets/style/colors.scss" as colors;
.hero {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  // place-items: center;
  gap: 12.8rem;
  padding: 0 3.2rem;
  margin-bottom: 15.6rem;

  &__title {
    font-size: 3.6rem;
    font-weight: 700;
    margin-bottom: 1.6rem;
  }

  &__description {
    color: colors.$neutral-text-secondary;
    font-size: 1.4rem;
    font-weight: 300;
    margin-bottom: 3.2rem;
    strong {
      color: colors.$neutral-text;
    }
  }
}

.bookshelf {
  width: 100%;
  height: 25.6rem;
  border-radius: 11px;
  background: colors.$neutral-bg-secondary;
  position: relative;

  &__shelf {
    background-color: colors.$neutral-bg;
    border: 1px solid colors.$neutral-text-secondary;
    border-radius: 7px;
    position: absolute;
    width: 110%;
    height: 1.6rem;
    top: 160px;
    left: 50px;
    z-index: 1;
  }

  .game__wrapper {
    display: flex;
    gap: 1.6rem;
    position: absolute;

    top: 75px;
    left: 77px;
    z-index: 2;
  }

  &__game {
    background: blue;
    border-radius: 7px;
    width: 75px;
    height: 100px;
  }

  &__game--big {
    background: crimson;
    width: 250px;
    height: 300px;
    top: 250px;
    left: -50px;
  }
}
</style>
