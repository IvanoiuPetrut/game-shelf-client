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
const testLabel = ref(true);
const platforms = ref<any[]>([
  { id: 4, name: "PC", checked: true },
  { id: 1, name: "Xbox", checked: false },
  { id: 6, name: "Linux", checked: false },
  { id: 7, name: "Nintendo-Switch", checked: false },
  { id: 8, name: "Nintendo-3DS", checked: false },
  { id: 187, name: "Playstation 5", checked: false },
  { id: 18, name: "Playstation 4", checked: false },
  { id: 16, name: "Playstation 3", checked: false },
]);

const fetchGames = async () => {
  axios
    .get(API_URL, {
      params: {
        search: gameQuery.value,
        genres: props.category,
        platforms: platforms.value
          .filter((platform) => platform.checked)
          .map((platform) => platform.id)
          .join(","),
      },
    })
    .then((response) => {
      games.value = response.data.results;
      console.log(response.data);
    });
};

// watch(gameQuery, () => {
//   fetchGames();
// });

//watch gameQuery and platforms
watch(
  [gameQuery, platforms],
  () => {
    fetchGames();
  },
  { deep: true }
);
</script>

<template>
  {{ props.category }}
  <p>Showing {3821} games</p>
  <input type="text" v-model="gameQuery" />
  <ul>
    <li>Genres {{ props.category }}</li>
    <li v-if="gameQuery.length > 0">Results for {{ gameQuery }}</li>
  </ul>
  {{ testLabel }}
  <GameFilters label="Action" v-model="testLabel" is></GameFilters>

  <GameFilters
    v-for="platform in platforms"
    :key="platform.id"
    :label="platform.name"
    v-model="platform.checked"
  ></GameFilters>
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
