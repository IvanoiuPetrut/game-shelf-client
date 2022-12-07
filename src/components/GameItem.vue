<template>
  <div class="game">
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
</template>

<script lang="ts">
import { ref } from "vue";
import { onBeforeMount } from "vue";
import axios from "axios";

export default {
  name: "GameItem",
  props: {
    gameId: String,
  },
  setup(props) {
    const gameName = ref("Fallout 3");
    const gameImage = ref(
      "https://images.unsplash.com/photo-1612820685478-301051f03dd4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1322&q=80"
    );
    // const gameGenre = ref("");

    const gameUrl = `https://api.rawg.io/api/games/${props.gameId}`;
    const gameApiKey = "f062f25bd9424cb6905d4ce655e4e583";

    onBeforeMount(() => {
      axios
        .get(gameUrl, {
          params: {
            key: gameApiKey,
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
}
.game__name {
  font-size: 1.4rem;
  font-weight: 500;
}

.game__img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 7px;
}
</style>
