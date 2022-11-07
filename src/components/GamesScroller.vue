<template>
  <div>
    <h2>
      <slot name="title">Featured Games</slot>
    </h2>
    <div v-if="gamesFromProps.length > 0" class="games">
      <div v-for="game in gamesFromProps" :key="game.id">
        <router-link :to="{ name: 'gameDetails', params: { id: game.id } }">
          <!-- <a href="#"> -->
          <GameItem>
            <template #name>
              {{ game.name }}
            </template>
            <template #image>
              <img :src="game.background_image" alt="game image" width="200" />
            </template>
          </GameItem>
          <!-- </a> -->
        </router-link>
      </div>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>

<script lang="ts">
import { computed } from "vue";
import GameItem from "../components/GameItem.vue";
export default {
  name: "GamesScroller",
  components: {
    GameItem,
  },
  props: {
    games: {
      default: () => [],
    },
  },

  setup(props) {
    const gamesFromProps = computed((): any => {
      return props.games;
    });

    return {
      gamesFromProps,
    };
  },
};
</script>

<style scoped>
.games {
  display: flex;
  gap: 1rem;
  overflow: auto;
}
</style>
