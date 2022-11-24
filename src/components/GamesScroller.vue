<script lang="ts">
import { computed, ref } from "vue";
import GameItem from "../components/GameItem.vue";
export default {
  name: "GamesScroller",
  components: {
    GameItem,
  },
  props: {
    games: {
      default: () => [],
    },
  },

  setup(props) {
    const currentSlide = ref(0);

    const gamesFromProps = computed((): any => {
      return props.games;
    });

    const gameSlides = computed((): any => {
      const numberOfGamesPerSlide = Math.ceil(props.games.length / 5);
      const slides = [];
      for (let i = 0; i < numberOfGamesPerSlide; i++) {
        slides.push(props.games.slice(i * 5, i * 5 + 5));
      }
      return slides;
    });

    const nextSlide = () => {
      if (currentSlide.value < gameSlides.value.length - 1) {
        currentSlide.value++;
      }
    };

    const prevSlide = () => {
      if (currentSlide.value > 0) {
        currentSlide.value--;
      }
    };

    return {
      gamesFromProps,
      props,
      gameSlides,
      nextSlide,
      prevSlide,
      currentSlide,
    };
  },
};
</script>

<template>
  <div class="games__wrapper">
    <div class="header">
      <h2>
        <slot name="title" class="title">Featured Games</slot>
      </h2>
      <div class="navigation">
        <button @click="prevSlide">left</button>
        <button @click="nextSlide">right</button>
      </div>
    </div>
    <div v-if="gamesFromProps.length > 0" class="games">
      <div
        v-for="game in gameSlides[currentSlide]"
        :key="game.id"
        class="game__wrapper"
      >
        <router-link :to="{ name: 'gameDetails', params: { id: game.id } }">
          <GameItem>
            <template #name>
              {{ game.name }}
            </template>
            <template #image>
              <img :src="game.background_image" alt="game image" width="200" />
            </template>
          </GameItem>
        </router-link>
      </div>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/style/colors.scss" as colors;
@use "@/assets/style/component.scss" as component;

.games__wrapper {
  @include component.container;
  margin-bottom: 12rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
}

.navigation {
  display: flex;
  gap: 1.2rem;
}

h2 {
  font-size: 1.8rem;
}

.games {
  display: flex;
  gap: 1rem;
  // overflow: auto;
}

.game__wrapper {
  width: 100%;
  // &:nth-last-child(-n + 5) {
  //   display: none;
  // }
  // &:nth-child(1 + 2 * 5) {
  //   display: none;
  // }
}
</style>
