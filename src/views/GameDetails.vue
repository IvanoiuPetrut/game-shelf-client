<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import axios from "axios";
import { API_URL } from "@/api";

const props = defineProps<{
  id: string;
}>();

const game = ref<any>({});
const gameScreenshots = ref<any>({});

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

onBeforeMount(() => {
  fetchGame();
  fetchGameScreenshots();
});
</script>

<template>
  <main>
    <h1>{{ game.name }}</h1>
    <p>{{ game.description_raw }}</p>
    <img :src="game.background_image" alt="game image" width="400" />
    <h2>Screenshots</h2>
    <div v-if="gameScreenshots.length > 0" class="screenshots">
      <img
        v-for="screenshot in gameScreenshots"
        :key="screenshot.id"
        :src="screenshot.image"
        alt="game screenshot"
        width="300"
      />
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
