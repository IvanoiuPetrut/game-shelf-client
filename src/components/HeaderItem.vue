<script setup lang="ts">
import { computed } from "vue";
import { useGamesTopCriticsStore } from "@/stores/games-top-critics";
import BaseButton from "./BaseButton.vue";
import HoverItem from "./HoverItem.vue";

const store = useGamesTopCriticsStore();

const gameBackgroundImage = computed((): any => {
  return store.games.map((game: any) => {
    return game.background_image;
  });
});
</script>

<template>
  <section class="hero">
    <div class="hero__section--description">
      <h1 class="hero__title">Game Shelf</h1>
      <p class="hero__description">
        Game Shelf is a <strong>community for gamers</strong> to share their
        thoughts on games and keep track of their game progression. With our
        platform, you can connect with other gamers, share your opinions, and
        discover new games to play. Whether you're a casual or hardcore gamer,
        Game Shelf has something for everyone.
      </p>
      <RouterLink to="/register">
        <BaseButton class="btn--cta">
          <template #text> Join the community </template>
        </BaseButton>
      </RouterLink>
    </div>
    <div class="hero__section--img" v-if="gameBackgroundImage.length > 0">
      <div class="bookshelf">
        <div class="bookshelf__shelf"></div>
        <div class="game__wrapper">
          <img
            :src="gameBackgroundImage[0]"
            alt="book shelf backgorund image"
            class="bookshelf__game"
          />
          <img
            :src="gameBackgroundImage[1]"
            alt="book shelf backgorund image"
            class="bookshelf__game"
          />
          <img
            :src="gameBackgroundImage[6]"
            alt="book shelf backgorund image"
            class="bookshelf__game"
          />
          <img
            :src="gameBackgroundImage[5]"
            alt="book shelf backgorund image"
            class="bookshelf__game"
          />
        </div>
        <HoverItem class="bookshelf__game--big">
          <template #content>
            <img
              :src="gameBackgroundImage[3]"
              alt="book shelf backgorund image"
            />
          </template>
        </HoverItem>
      </div>
    </div>
    <div v-else>
      <div class="skeleton"></div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use "@/assets/style/colors.scss" as colors;
@use "@/assets/style/_component.scss" as components;
.hero {
  @include components.container;
  display: grid;
  gap: 6.4rem;
  margin-bottom: 12.4rem;

  @media (min-width: 400px) {
    margin-bottom: 18.2rem;
  }

  @media (min-width: 768px) {
    margin-bottom: 24.6rem;
  }

  @media (min-width: 1300px) {
    grid-template-columns: 1.5fr 1fr;
  }

  &__section--description {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    @media (min-width: 1300px) {
      align-items: flex-start;
    }
  }

  &__section--img {
    padding: 0 1.6rem;
  }

  &__title {
    font-size: 2.4rem;
    font-weight: 700;
    margin-bottom: 1.6rem;

    @media (min-width: 768px) {
      font-size: 3.6rem;
    }

    @media (min-width: 1300px) {
      font-size: 4.2rem;
    }
  }

  &__description {
    color: colors.$neutral-text-secondary;
    font-size: 1.4rem;
    font-weight: 300;
    text-align: center;
    margin-bottom: 3.2rem;

    @media (min-width: 1300px) {
      text-align: left;
    }
    strong {
      color: colors.$neutral-text;
    }
  }
}

.bookshelf {
  width: min(100%, 500px);
  height: 25.6rem;
  border-radius: 11px;
  background: colors.$neutral-bg-secondary;
  position: relative;
  box-shadow: 0 10px 10px 10px rgba(0, 0, 0, 0.1),
    0 2px 4px 0 rgba(0, 0, 0, 0.1);
  margin: 0 auto;

  &__shelf {
    background-color: colors.$neutral-bg;
    border: 1px solid colors.$neutral-text-secondary;
    border-radius: 7px;
    position: absolute;
    width: 100%;
    height: 1.6rem;
    top: 160px;
    left: 0;
    z-index: 1;

    @media (min-width: 550px) {
      left: 15%;
      width: 90%;
    }
  }

  .game__wrapper {
    display: flex;
    gap: 1.6rem;
    position: absolute;

    top: 18%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;

    @media (min-width: 550px) {
      left: 60%;
    }
  }

  &__game {
    border-radius: 7px;
    width: 75px;
    height: 100px;
    object-fit: cover;
    box-shadow: 0 0 0 5px rgba(0, 0, 0, 0.1), 0 2px 4px 0 rgba(0, 0, 0, 0.1);
    &:nth-last-child(2),
    &:last-child {
      display: none;
      @media (min-width: 550px) {
        display: block;
      }
    }
  }

  &__game--big {
    width: min(100%, 300px);
    height: min(70vw, 350px);
    top: 250px;
    left: -25px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 7px;
    }
  }
}

.btn--cta {
  font-size: 1.2rem;
  padding: 0.8rem 1.6rem;
}

.skeleton {
  border-radius: 7px;
  animation: pulse-bg 1s infinite;
}

@keyframes pulse-bg {
  0% {
    background-color: colors.$neutral-bg-secondary;
  }
  50% {
    background-color: colors.$neutral-bg;
  }
  100% {
    background-color: colors.$neutral-bg-secondary;
  }
}
</style>
