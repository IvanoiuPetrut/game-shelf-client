<template>
  <div>
    <p>
      <slot name="name">Name of the game</slot>
    </p>
    <slot name="image">
      <img :src="gameImage" alt="game image" width="200" />
    </slot>
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

<style lang="scss" scoped></style>
