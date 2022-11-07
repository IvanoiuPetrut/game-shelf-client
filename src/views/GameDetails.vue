<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import axios from "axios";
import { API_URL } from "@/api";

const props = defineProps<{
  id: string;
}>();

const game = ref<any>({});
const gameScreenshots = ref<any>({});
const gameTrailers = ref<any>({});

const fetchGame = async () => {
  axios.get(`${API_URL}/${props.id}`).then((res) => {
    game.value = res.data;
  });
};

const fetchGameScreenshots = async () => {
  axios.get(`${API_URL}/${props.id}/screenshots`).then((res) => {
    gameScreenshots.value = res.data.results;
  });
};

const fetchGameTrailers = async () => {
  axios.get(`${API_URL}/${props.id}/movies`).then((res) => {
    gameTrailers.value = res.data.results;
    console.log(res.data.results);
  });
};

onBeforeMount(() => {
  fetchGame();
  fetchGameScreenshots();
  fetchGameTrailers();
});
</script>

<template>
  <main>
    <h1>{{ game.name }}</h1>
    <p>{{ game.description_raw }}</p>
    <img :src="game.background_image" alt="game image" width="400" />
    <div v-if="gameScreenshots.length > 0" class="screenshots">
      <h2>Screenshots</h2>
      <img
        v-for="screenshot in gameScreenshots"
        :key="screenshot.id"
        :src="screenshot.image"
        alt="game screenshot"
        width="300"
      />
    </div>
    <div v-if="gameTrailers.length > 0" class="trailers">
      <h2>Trailers</h2>
      <iframe
        v-for="trailer in gameTrailers"
        :key="trailer.id"
        :src="trailer.data.max"
        width="300"
        height="200"
        allowfullscreen
      ></iframe>
    </div>
    <!-- <p>Developed by {{ game.developers[0].name }}</p> -->
    <!-- <p>Published by {{ game.publishers[0].name }}</p> -->
    <p>Available on</p>
    <ul>
      <li v-for="platform in game.platforms" :key="platform.platform.id">
        {{ platform.platform.name }}
      </li>
    </ul>
    <p>Buy from</p>
    <ul>
      <li v-for="store in game.stores" :key="store.store.id">
        <a :href="store.url">{{ store.store.name }}</a>
      </li>
    </ul>
  </main>
</template>
