<script setup lang="ts">
import { ref, computed, onBeforeMount } from "vue";
import axios from "axios";
import { API_URL } from "@/api";

const props = defineProps<{
  id: string;
}>();

const game = ref<any>({});
const gameScreenshots = ref<any>({});
const gameTrailers = ref<any>({});
const gameStoreLinks = ref<any>({});

const gameReleaseDate = computed(() => {
  return new Date(game.value.released).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
});

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
  });
};

const fetchGameStoreLinks = async () => {
  axios.get(`${API_URL}/${props.id}/stores`).then((res) => {
    gameStoreLinks.value = res.data.results;
  });
};

onBeforeMount(() => {
  fetchGame();
  fetchGameScreenshots();
  fetchGameStoreLinks();
  fetchGameTrailers();
});
</script>

<template>
  <main>
    <div class="game">
      <img
        :src="game.background_image"
        alt="game image"
        width="400"
        class="game__img"
      />
      <div class="game__details">
        <h1 class="game__name">{{ game.name }}</h1>
        <div class="game__release">
          <div class="release__field">
            <p class="release__type">Developer</p>
            <p class="release__value">{{ game.developers[0].name }}</p>
          </div>
          <div class="release__field">
            <p class="release__type">Publisher</p>
            <p class="release__value">{{ game.publishers[0].name }}</p>
          </div>
          <div class="release__field">
            <p class="release__type">Released</p>
            <p class="release__value">
              {{ gameReleaseDate }}
            </p>
          </div>
        </div>
        <p class="game__description">{{ game.description_raw }}</p>
      </div>
    </div>
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
    <p>Available on</p>
    <ul>
      <li v-for="platform in game.platforms" :key="platform.platform.id">
        {{ platform.platform.name }}
      </li>
    </ul>
    <p>Buy from</p>
    <ul>
      <li v-for="(store, index) in game.stores" :key="store.store.id">
        <a :href="gameStoreLinks[index].url" target="_blank">{{
          store.store.name
        }}</a>
        <!-- {{ gameStoreLinks[store.store.id].url }} -->
      </li>
    </ul>
  </main>
</template>

<style lang="scss" scoped>
@use "@/assets/style/colors.scss" as colors;
.game {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;

  &__name {
    font-size: 1.8rem;
    font-weight: bold;
  }

  &__details {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    padding: 0 1rem;
  }

  &__img {
    // width: min(100%, 400px);
    width: 100%;
    height: min(50vw, 300px);
    object-fit: cover;
  }

  &__description {
    color: colors.$neutral-text-secondary;
  }
}

.game__release {
  .release {
    &__field {
      display: flex;
      gap: 1.6rem;
      align-items: center;
    }

    &__type {
      font-size: 1rem;
      color: colors.$neutral-text-secondary;
    }

    &__value {
      font-size: 1.2rem;
      font-weight: bold;
    }
  }
}
</style>
