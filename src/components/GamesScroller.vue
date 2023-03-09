<script lang="ts">
import { computed, ref } from "vue";
import GameItem from "../components/GameItem.vue";
import IconArrowLeft from "../components/icons/IconArrowLeft.vue";
import IconArrowRight from "../components/icons/IconArrowRight.vue";
export default {
  name: "GamesScroller",
  components: {
    GameItem,
    IconArrowLeft,
    IconArrowRight,
  },
  props: {
    games: {
      default: () => [],
    },
  },

  setup(props) {
    const gamesFromProps = computed((): any => {
      return props.games;
    });

    const fristItem = ref(0);
    const lastItem = ref(2);

    const scrollRight = () => {
      if (lastItem.value > gamesFromProps.value.length) return;
      fristItem.value += 3;
      lastItem.value += 3;
    };

    const scrollLeft = () => {
      if (lastItem.value < 3) return;
      fristItem.value -= 3;
      lastItem.value -= 3;
    };

    return {
      gamesFromProps,
      props,
      fristItem,
      lastItem,
      scrollRight,
      scrollLeft,
    };
  },
};
</script>

<template>
  <div class="wrapper">
    <div class="header">
      <h2 class="title">
        <slot name="title"></slot>
      </h2>
      <div class="navigation">
        <button @click="scrollLeft" class="btn">
          <IconArrowLeft></IconArrowLeft>
        </button>
        <button @click="scrollRight" class="btn">
          <IconArrowRight></IconArrowRight>
        </button>
      </div>
    </div>
    <div v-if="props.games.length > 0" class="games">
      <RouterLink
        v-for="(game, index) in gamesFromProps"
        :key="game.id"
        :to="{ name: 'gameDetails', params: { id: game.id } }"
        class="game__wrapper"
        :class="{
          'game__wrapper--active': index >= fristItem && index <= lastItem,
        }"
      >
        <GameItem :gameId="game.id">
          <template #genre v-if="game.genres.length > 0">
            {{ game.genres[0].name }}
          </template>
        </GameItem>
      </RouterLink>
    </div>
    <div v-else>
      <div class="skeleton"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/style/colors.scss" as colors;
@use "@/assets/style/component.scss" as component;

.wrapper {
  @include component.container;
  margin-bottom: 6.4rem;

  @media (min-width: 768px) {
    margin-bottom: 12.6rem;
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 1.2rem;

  .navigation {
    display: none;

    @media (min-width: 1050px) {
      display: flex;
      gap: 1.2rem;
    }
  }
}

h2 {
  font-size: 1.2rem;
  font-weight: 600;

  @media (min-width: 500px) {
    font-size: 1.6rem;
  }

  @media (min-width: 1050px) {
    font-size: 2.4rem;
  }
}

.games {
  display: flex;
  gap: 1.6rem;
  width: 100%;
  overflow: auto;

  @media screen and (min-width: 768px) {
    -webkit-overflow-scrolling: unset;
  }

  @media (min-width: 1050px) {
    justify-content: space-between;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}

.game__wrapper {
  flex-shrink: 0;
  width: 16.8rem;

  @media (min-width: 1050px) {
    display: none;
  }

  @media (min-width: 1200px) {
    width: calc(100% / 3 - 1.6rem);
  }
}

.game__wrapper--active {
  display: block;
}

.skeleton {
  border-radius: 7px;
  animation: pulse-bg 1s infinite;
  width: 100%;
  height: 18.6rem;
  border-radius: 7px;
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
