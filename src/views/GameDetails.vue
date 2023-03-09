<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
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

const howGoodIsTheScore = (score: number): string => {
  if (score >= 90) {
    return "🤩";
  } else if (score >= 70) {
    return "😀";
  } else if (score >= 50) {
    return "😐";
  } else {
    return "😭";
  }
};

const fetchGameDetails = async () => {
  Promise.all([
    axios.get(`${API_URL}/games/${props.id}`),
    axios.get(`${API_URL}/games/${props.id}/screenshots`),
    axios.get(`${API_URL}/games/${props.id}/movies`),
    axios.get(`${API_URL}/games/${props.id}/stores`),
  ]).then((response) => {
    game.value = response[0].data;
    gameScreenshots.value = response[1].data.results;
    gameTrailers.value = response[2].data.results;
    gameStoreLinks.value = response[3].data.results;
  });
};

onMounted(() => {
  fetchGameDetails();
});
</script>

<template>
  <main class="main">
    <div class="game" v-if="game.id !== undefined">
      <div class="game__details-wrapper">
        <div>
          <img
            :src="game.background_image"
            alt="game image"
            width="350"
            class="game__img"
            loading="lazy"
          />
        </div>
        <div class="game__details game__details--primary">
          <h1 class="game__name">{{ game.name }}</h1>
          <div class="game__rating">
            <div class="rating__field">
              <p class="rating__type">Metacritic</p>
              <span class="rating__score" v-if="game.metacritic !== null"
                >{{ game.metacritic }}
                {{ howGoodIsTheScore(game.metacritic) }}</span
              >
            </div>
          </div>
          <div class="game__release">
            <div class="release__field">
              <p class="release__type">Developer</p>
              <router-link
                class="release__value"
                :to="{
                  name: 'developer',
                  params: { developer: game.developers[0].id },
                }"
              >
                {{ game.developers[0].name }}
              </router-link>
            </div>
            <div class="release__field">
              <p class="release__type">Publisher</p>
              <router-link
                class="release__value"
                v-if="game.publishers.length > 0"
                :to="{
                  name: 'publisher',
                  params: { publisher: game.publishers[0].id },
                }"
              >
                {{ game.publishers[0].name }}
              </router-link>
            </div>
            <div class="release__field">
              <p class="release__type">Released</p>
              <p class="release__value">
                {{ gameReleaseDate }}
              </p>
            </div>
          </div>
          <div>
            <p class="game__description" v-html="game.description"></p>
          </div>
        </div>
      </div>
      <div class="game__details">
        <div v-if="gameScreenshots.length > 0">
          <h2 class="details__title">Screenshots</h2>
          <div class="game__screenshots">
            <img
              v-for="screenshot in gameScreenshots"
              :key="screenshot.id"
              :src="screenshot.image"
              alt="game screenshot"
              width="300"
              loading="lazy"
            />
          </div>
        </div>
        <div v-if="gameTrailers.length > 0" class="trailers">
          <h2 class="details__title">Trailers</h2>
          <iframe
            v-for="trailer in gameTrailers"
            :key="trailer.id"
            :src="trailer.data.max"
            width="300"
            height="200"
            allowfullscreen
          ></iframe>
        </div>
        <p class="details__title">Available on</p>
        <ul class="platforms">
          <li v-for="platform in game.platforms" :key="platform.platform.id">
            {{ platform.platform.name }}
          </li>
        </ul>
        <p class="details__title">Buy from</p>
        <ul class="stores">
          <li v-for="(store, index) in game.stores" :key="store.store.id">
            <a :href="gameStoreLinks[index].url" target="_blank">{{
              store.store.name
            }}</a>
          </li>
        </ul>
      </div>
    </div>
    <div v-else>
      <div class="skeleton"></div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
@use "@/assets/style/colors.scss" as colors;
@use "@/assets/style/component.scss" as component;

main {
  @include component.container;
}
.game {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  // margin: 3.2rem 3.2rem 1rem 1rem;

  &__name {
    font-size: 1.8rem;
    font-weight: bold;
  }

  &__details-wrapper {
    @media (min-width: 850px) {
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: 1rem;
      margin-bottom: 5.6rem;
    }
  }

  &__details {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    padding: 0 1rem;
  }

  &__details--primary {
    @media (min-width: 850px) {
      margin: 3.2rem 0 0 0;
      padding: 1.2rem;
      padding-left: calc(40% + 1.2rem);
      position: absolute;
      left: 3.2rem;

      background-color: colors.$neutral-bg-secondary;
      border-radius: 11px;
    }
  }

  &__img {
    width: 100%;
    height: min(50vw, 300px);
    object-fit: cover;
    z-index: 1;
    border-radius: 9px;

    @media (min-width: 850px) {
      height: 24.4rem;
      border-radius: 11px;
    }
  }

  &__description {
    color: colors.$neutral-text-secondary;
    --max-lines: 6;

    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: var(--max-lines);
  }

  &__screenshots {
    display: flex;
    gap: 0.8rem;
    overflow: auto;

    @media (min-width: 850px) {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      place-items: center;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 11px;
      }
    }

    @media (min-width: 1200px) {
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    }
  }
}

.game__rating {
  display: flex;
  gap: 1.6rem;
  // align-self: center;
  .rating {
    &__field {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      background-color: colors.$neutral-bg-secondary;
      padding: 0.4rem 0.8rem;
      border-radius: 11px;

      @media (min-width: 850px) {
        background-color: colors.$neutral-bg;
      }
    }

    &__type {
      color: colors.$neutral-text-secondary;
      font-size: 1rem;
    }

    &__score {
      font-size: 1.4rem;
      font-weight: bold;
    }
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

.details__title {
  font-size: 1.8rem;
  font-weight: 500;
  margin-top: 3.2rem;

  @media (min-width: 850px) {
    font-size: 2.4rem;
  }

  &:first-child {
    margin-bottom: 1.6rem;
  }
}

.platforms {
  display: flex;
  // flex-direction: column;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 0.8rem;

  font-size: 1.2rem;

  li {
    background-color: colors.$neutral-bg-secondary;
    padding: 0.4rem 0.8rem;
    border-radius: 11px;
  }
}

.stores {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  font-size: 1.4rem;
  font-weight: bold;

  li:before {
    content: ">";
    margin-right: 0.8rem;
  }

  a {
    color: colors.$primary;
    font-weight: 700;

    &:hover {
      text-decoration: underline;
    }
  }
}
.skeleton {
  border-radius: 7px;
  animation: pulse-bg 1s infinite;
  width: 100%;
  height: 100vh;
}

@keyframes pulse-bg {
  0% {
    background-color: colors.$neutral-bg-secondary;
  }
  50% {
    background-color: colors.$neutral-bg;
  }
  100% {
    background-color: colors.$neutral-bg-secondary;
  }
}
</style>
