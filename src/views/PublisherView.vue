<script setup lang="ts">
import { onMounted, ref } from "vue";
import axios from "axios";
import { API_URL } from "@/api";
import GameItem from "@/components/GameItem.vue";

const props = defineProps<{
  publisher: string;
}>();

const games = ref<any[]>([]);
const publisherDetails = ref<any>({});

const fetchDeveloperDetails = async () => {
  axios
    .get(`${API_URL}/publishers/${props.publisher}`)
    .then((response) => {
      publisherDetails.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

const fetchGames = async () => {
  axios
    .get(`${API_URL}/games`, {
      params: {
        ordering: "-metacritic",
        publishers: props.publisher,
      },
    })
    .then((response) => {
      games.value = response.data.results;
      // console.log(
    })
    .catch((error) => {
      console.log(error);
    });
};

onMounted(() => {
  fetchGames();
  fetchDeveloperDetails();
});
</script>

<template>
  <div class="wrapper">
    <h1>Games published by {{ publisherDetails.name }}</h1>
    <div v-if="games.length > 0" class="games">
      <router-link
        v-for="game in games"
        :key="game.id"
        :to="{ name: 'gameDetails', params: { id: game.id } }"
      >
        <GameItem :gameId="game.id" />
      </router-link>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/style/component.scss" as component;
@use "@/assets/style/colors.scss" as colors;

.wrapper {
  @include component.container;
}

h1 {
  margin-bottom: 3.2rem;
}
.games {
  display: grid;
  row-gap: 3.2rem;
  column-gap: 2rem;

  @media (min-width: 550px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 850px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1300px) {
    grid-template-columns: repeat(5, 1fr);
  }
}
</style>
