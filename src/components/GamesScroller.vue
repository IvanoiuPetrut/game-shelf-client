<!-- <script setup lang="ts">
import GameItem from "../components/GameItem.vue";
</script> -->

<template>
  <div>
    <h2>
      <slot>Featured Games</slot>
    </h2>
    <div v-if="gameList.length > 0" class="games">
      <GameItem v-for="(game, index) in gameList" :key="index" :game-id="'187'">
        <template #name>
          {{ game.name }}
        </template>
        <template #image>
          <img :src="game.background_image" alt="game image" width="200" />
        </template>
      </GameItem>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { onBeforeMount } from "vue";
import axios from "axios";
import GameItem from "../components/GameItem.vue";

export default {
  name: "GamesScroller",
  components: {
    GameItem,
  },
  props: {
    games: {
      type: Array,
    },
  },

  setup() {
    const gameList = ref<any[]>([]);

    // const gameUrl = `https://api.rawg.io/api/games`;
    const gameUrl = "http://localhost:8080/games/popular";
    const gameApiKey = "f062f25bd9424cb6905d4ce655e4e583";

    onBeforeMount(() => {
      axios
        .get(gameUrl, {
          params: {
            key: gameApiKey,
            ordering: "-metacritic",
            platforms: "1",
            page_size: "10",
            exclude_additions: "true",
            dates: "2020-01-01,2022-11-01",
          },
        })
        .then((response) => {
          gameList.value = response.data.results;
        });
    });

    return {
      gameList,
    };
  },
};
</script>

<style scoped>
.games {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>
