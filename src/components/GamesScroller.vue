<script lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import GameItem from "../components/GameItem.vue";
import IconArrowLeftVue from "../components/icons/IconArrowLeft.vue";
import IconArrowRightVue from "../components/icons/IconArrowRight.vue";
export default {
  name: "GamesScroller",
  components: {
    GameItem,
    IconArrowLeftVue,
    IconArrowRightVue,
  },
  props: {
    games: {
      default: () => [],
    },
  },

  setup(props) {
    const currentSlide = ref(0);
    const windowWidth = ref(0);

    const getWindowWidth = () => {
      windowWidth.value = window.innerWidth;
    };

    const gamesFromProps = computed((): any => {
      return props.games;
    });

    const gameSlides = computed((): any => {
      let numberOfGames =
        windowWidth.value > 1200
          ? 4
          : windowWidth.value > 800
          ? 3
          : windowWidth.value > 500
          ? 2
          : 1;
      const numberOfGamesPerSlide = Math.ceil(
        props.games.length / numberOfGames
      );
      const slides = [];
      for (let i = 0; i < numberOfGamesPerSlide; i++) {
        slides.push(
          props.games.slice(
            i * numberOfGames,
            i * numberOfGames + numberOfGames
          )
        );
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

    onMounted(() => {
      getWindowWidth();
      window.addEventListener("resize", getWindowWidth);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", getWindowWidth);
    });

    return {
      gamesFromProps,
      props,
      gameSlides,
      nextSlide,
      prevSlide,
      currentSlide,
      windowWidth,
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
        <button
          @click="prevSlide"
          class="btn"
          :class="{ disabled: currentSlide === 0 }"
        >
          <IconArrowLeftVue></IconArrowLeftVue>
        </button>
        <button
          @click="nextSlide"
          class="btn"
          :class="{ disabled: currentSlide === gameSlides.length - 1 }"
        >
          <IconArrowRightVue></IconArrowRightVue>
        </button>
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
            <template #image>
              <div class="img__wrapper">
                <img
                  :src="game.background_image"
                  alt="game image"
                  width="200"
                  class="game__img"
                />
              </div>
            </template>
            <template #name>
              {{ game.name }}
            </template>
            <template #genre>
              {{ game.genres[0].name }}
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

.games {
  display: flex;
  gap: 1.6rem;
}

.game__wrapper {
  width: 100%;
  &:hover {
    .game__img {
      transform: scale(1.05);
    }
  }
}

.img__wrapper {
  width: 100%;
  height: 18.6rem;
  object-fit: cover;
  border-radius: 7px;
  overflow: hidden;
}

.game__img {
  width: 100%;
  height: 100%;
  object-fit: cover;

  transition: transform 0.3s ease-in-out;
}

.btn {
  padding: 0.4rem 0.6rem;
}

.disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
