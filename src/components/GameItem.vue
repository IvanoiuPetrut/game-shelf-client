<template>
  <div v-if="gameName" class="game">
    <div>
      <slot name="image">
        <img :src="gameImage" alt="game image" width="200" class="game__img" />
      </slot>
      <div class="game__content">
        <p class="game__genre">
          <slot name="genre"></slot>
        </p>
        <p class="game__name">
          <slot name="name">{{ gameName }}</slot>
        </p>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="game__img skeleton"></div>
    <p class="game__name skeleton"></p>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { onBeforeMount } from "vue";
import axios from "axios";

export default {
  name: "GameItem",
  props: {
    gameId: [String, Number],
  },
  setup(props) {
    const gameName = ref(null);
    const gameImage = ref();

    const gameUrl = `https://api.rawg.io/api/games/${props.gameId}`;

    onBeforeMount(() => {
      axios
        .get(gameUrl, {
          params: {
            key: import.meta.env.VITE_RAWG_API_KEY,
          },
        })
        .then((response) => {
          gameName.value = response.data.name;
          gameImage.value = response.data.background_image;
        });
    });

    return {
      gameName,
      gameImage,
    };
  },
};
</script>

<style scoped lang="scss">
@use "@/assets/style/colors.scss" as colors;
.game {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.game__content {
  font-size: 1.2rem;
  color: colors.$neutral-text;
}

.game__genre {
  font-size: 1rem;
  color: colors.$neutral-text-secondary;
  text-transform: uppercase;
  font-weight: 500;
  margin-top: 0.8rem;
}
.game__name {
  font-size: 1.4rem;
  font-weight: 500;
  margin-top: 0.4rem;
}

.game__img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 7px;
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
