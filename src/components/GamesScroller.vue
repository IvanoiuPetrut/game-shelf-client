<!-- <script setup lang="ts">
import GameItem from "../components/GameItem.vue";
</script> -->

<template>
  <div>
    <h2>
      <slot>Featured Games</slot>
      <p>{{ gamesTopCriticsStore.games }}</p>
    </h2>
    <div v-if="gameList.length > 0" class="games">
      <GameItem v-for="(game, index) in gameList" :key="index" :game-id="'187'">
        <template #name>
          {{ game.name }}
          <!-- salut -->
        </template>
        <template #image>
          <img :src="game.background_image" alt="game image" width="200" />
          salut 2
        </template>
      </GameItem>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { onBeforeMount } from "vue";
import axios from "axios";
import { useGamesTopCriticsStore } from "@/stores/games-top-critics";
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
    const gamesTopCritics = useGamesTopCriticsStore();
    const gameList = ref<any>([]);

    // const gameUrl = "http://localhost:8080/games/popular";

    onBeforeMount(() => {
      // axios
      //   .get(gameUrl, {
      //     params: {
      //       ordering: "-metacritic",
      //       platforms: "1",
      //       page_size: "10",
      //       exclude_additions: "true",
      //       dates: "2020-01-01,2022-11-01",
      //     },
      //   })
      //   .then((response) => {
      //     gameList.value = response.data.results;
      //   });
      gamesTopCritics.fetchGames();
      console.log(gameList.value + "value of games");
    });

    return {
      gameList,
      // gamesTopCritics,
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
