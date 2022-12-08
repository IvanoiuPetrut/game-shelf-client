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
const genres = ref<any[]>([
  { id: 4, name: "Action", checked: false },
  { id: 51, name: "Indie", checked: false },
  { id: 3, name: "Adventure", checked: false },
  { id: 5, name: "RPG", checked: false },
  { id: 10, name: "Strategy", checked: false },
  { id: 2, name: "Shooter", checked: false },
  { id: 40, name: "Casual", checked: false },
  { id: 7, name: "Puzzle", checked: false },
  { id: 11, name: "Arcade", checked: false },
  { id: 83, name: "Platformer", checked: false },
  { id: 1, name: "Racing", checked: false },
  { id: 15, name: "Sports", checked: false },
]);
const tags = ref<any[]>([
  { id: 31, name: "Singleplayer", checked: false },
  { id: 7, name: "Multiplayer", checked: false },
  { id: 13, name: "Atmosferic", checked: false },
  { id: 42, name: "Great Soundtrack", checked: false },
  { id: 18, name: "Co-op", checked: false },
]);

const fetchGames = async () => {
  axios
    .get(API_URL, {
      params: {
        search: gameQuery.value,
        genres:
          genres.value
            .filter((genre) => genre.checked)
            .map((genre) => genre.id)
            .join(",") || null,
        platforms:
          platforms.value
            .filter((platform) => platform.checked)
            .map((platform) => platform.id)
            .join(",") || null,
        tags:
          tags.value
            .filter((tag) => tag.checked)
            .map((tag) => tag.id)
            .join(",") || null,
      },
    })
    .then((response) => {
      games.value = response.data.results;
      console.log(response.data);
    });
};

watch(
  [gameQuery, platforms, genres, tags],
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

  <div>
    <p>Tags</p>
    <GameFilters
      v-for="tag in tags"
      :key="tag.id"
      :label="tag.name"
      v-model="tag.checked"
    ></GameFilters>
  </div>

  <div>
    <p>Genres</p>
    <GameFilters
      v-for="genre in genres"
      :key="genre.id"
      :label="genre.name"
      v-model="genre.checked"
    ></GameFilters>
  </div>

  <div>
    <p>Platforms</p>
    <GameFilters
      v-for="platform in platforms"
      :key="platform.id"
      :label="platform.name"
      v-model="platform.checked"
    ></GameFilters>
  </div>
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
