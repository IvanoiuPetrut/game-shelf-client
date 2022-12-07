<script setup lang="ts">
import { ref, watch } from "vue";
import axios from "axios";
import { API_URL } from "@/api";
import GameItem from "@/components/GameItem.vue";
import GameFilters from "@/components/GameFilters.vue";

const props = defineProps<{
  category: string;
}>();

const gameQuery = ref("");
const games = ref<any[]>([]);
// const genres = ref;
const platforms = ref<any>("no");
const testLabel = ref<any>("");

const fetchGames = async () => {
  axios
    .get(API_URL, {
      params: {
        search: gameQuery.value,
        genres: props.category,
        platforms: "1",
      },
    })
    .then((response) => {
      console.log(response.data.results);
      games.value = response.data.results;
      // console.log(games.value);
    });
};

watch(gameQuery, () => {
  console.log("gameQuery changed");
  fetchGames();
});
</script>

<template>
  {{ props.category }}
  <p>Showing {3821} games</p>
  <input type="text" v-model="gameQuery" />
  <ul>
    <li>Genres {{ props.category }}</li>
    <li v-if="gameQuery.length > 0">Results for {{ gameQuery }}</li>
  </ul>
  {{ platforms }}
  <input
    type="checkbox"
    id="action"
    v-model="platforms"
    true-value="yes"
    false-value="no"
  />
  {{ testLabel }}
  <GameFilters label="Action" v-model="testLabel"></GameFilters>
  <div class="games">
    <router-link
      v-for="game in games"
      :key="game.id"
      :to="{ name: 'gameDetails', params: { id: game.id } }"
    >
      <GameItem :gameId="game.id" />
    </router-link>
  </div>
</template>

<style scope lang="scss">
.games {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  row-gap: 3.2rem;
  column-gap: 2rem;
}

.game__img {
  width: 100%;
}
</style>
