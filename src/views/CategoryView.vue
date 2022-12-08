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

const stores = ref<any[]>([
  { id: 1, name: "Steam", checked: false },
  { id: 2, name: "Xbox Store", checked: false },
  { id: 3, name: "Playstation Store", checked: false },
  { id: 5, name: "GOG", checked: false },
  { id: 6, name: "Nintendo Store", checked: false },
  { id: 11, name: "Epic Games", checked: false },
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
        stores:
          stores.value
            .filter((store) => store.checked)
            .map((store) => store.id)
            .join(",") || null,
      },
    })
    .then((response) => {
      games.value = response.data.results;
      console.log(response.data);
    });
};

const areFiltersActive = ref(false);

const toggleFilters = () => {
  areFiltersActive.value = !areFiltersActive.value;
  console.log(areFiltersActive.value);
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
  <div class="wrapper">
    <input class="game__input" type="text" v-model="gameQuery" />
    <p class="game__number">Showing {3821} games</p>

    <div class="grid">
      <aside class="filters" :class="{ active: areFiltersActive }">
        <div class="filters__field">
          <h4 class="filters__title">Filters</h4>
          <p class="filters__type">Stores</p>
          <GameFilters
            v-for="store in stores"
            :key="store.id"
            :label="store.name"
            v-model="store.checked"
          ></GameFilters>
        </div>
        <div class="filters__field">
          <p class="filters__type">Tags</p>
          <GameFilters
            v-for="tag in tags"
            :key="tag.id"
            :label="tag.name"
            v-model="tag.checked"
          ></GameFilters>
        </div>
        <div class="filters__field">
          <p class="filters__type">Genres</p>
          <GameFilters
            v-for="genre in genres"
            :key="genre.id"
            :label="genre.name"
            v-model="genre.checked"
          ></GameFilters>
        </div>
        <div class="filters__field--last">
          <p class="filters__type">Platforms</p>
          <GameFilters
            v-for="platform in platforms"
            :key="platform.id"
            :label="platform.name"
            v-model="platform.checked"
          ></GameFilters>
        </div>
        <button class="btn" @click="toggleFilters">Filters</button>
      </aside>
      <main class="games">
        <router-link
          v-for="game in games"
          :key="game.id"
          :to="{ name: 'gameDetails', params: { id: game.id } }"
        >
          <GameItem :gameId="game.id" />
        </router-link>
      </main>
    </div>
  </div>
</template>

<style scope lang="scss">
@use "@/assets/style/component.scss" as component;
@use "@/assets/style/colors.scss" as colors;

.wrapper {
  @include component.container;
}

.grid {
  // display: grid;
  // grid-template-columns: 1fr 4fr;
  // column-gap: 2rem;
}

.filters {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.2rem 2.4rem;
  position: fixed;
  top: 0;
  left: -110%;
  background: colors.$neutral-gradient;
  width: 100vw;
  height: 100vh;
  overflow: auto;
  z-index: 99;

  .btn {
    position: fixed;
    bottom: 5%;
    right: 50%;
    transform: translateX(50%);
    width: min(30%, 8.4rem);
    letter-spacing: 0.1rem;
    z-index: 999;
  }
}

.filters__title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.filters__field--last {
  margin-bottom: 5rem;
}

.filters__type {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.form__label {
  font-weight: 500;
}

.active {
  // top: 0;
  left: 0;
}

.games {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  row-gap: 3.2rem;
  column-gap: 2rem;
}

.game__input {
  width: 100%;
  padding: 0.6rem;
  border-radius: 100px;
  border: none;
  margin-bottom: 1.2rem;

  &:focus {
    outline: none;
  }
}

.game__img {
  width: 100%;
}
</style>
