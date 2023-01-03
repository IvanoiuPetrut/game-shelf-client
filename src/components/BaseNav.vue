<script setup lang="ts">
import { ref, watch } from "vue";
import { API_URL } from "@/api";
import axios from "axios";
import BaseSeachBar from "./BaseSeachBar.vue";
import IconBook from "./icons/IconBook.vue";
import IconMenu from "./icons/IconMenu.vue";

const gameQuery = ref("");
const games = ref<any[]>([]);
const isMobileNavVisible = ref(false);

const toggleMobileNav = () => {
  isMobileNavVisible.value = !isMobileNavVisible.value;
  console.log(isMobileNavVisible.value);
};

const fetchGames = async () => {
  axios
    .get(`${API_URL}/games`, {
      params: {
        search: gameQuery.value,
      },
    })
    .then((response) => {
      games.value = response.data.results;
      console.log(response.data);
    });
};

watch(gameQuery, () => {
  fetchGames();
});
</script>

<template>
  <div class="nav__wrapper">
    <nav class="nav">
      <div class="nav__left">
        <RouterLink to="/" class="nav__logo">
          <IconBook /> GameShelf
        </RouterLink>
      </div>
      <button class="nav__burger btn" @click="toggleMobileNav">
        <IconMenu />
      </button>
      <div class="search-bar__wrapper">
        <BaseSeachBar
          v-model="gameQuery"
          label="Search for games"
          class="search-bar"
        />
        <ul v-if="games.length > 0" class="results">
          <li v-for="game in games" :key="game.id" class="results__item">
            <router-link :to="{ name: 'gameDetails', params: { id: game.id } }">
              {{ game.name }}
            </router-link>
          </li>
        </ul>
      </div>
      {{ gameQuery }}
      <div
        class="nav__right"
        :class="{ 'nav__right--visible': isMobileNavVisible }"
      >
        <router-link
          :to="{ name: 'category', params: { category: 'default' } }"
        >
          Categories
        </router-link>
        <router-link :to="{ name: 'about' }">About</router-link>
        <router-link :to="{ name: 'register' }">Register</router-link>

        <!-- <router-link :to="{ name: 'login' }">Login</router-link> -->
      </div>
    </nav>
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/style/colors.scss" as colors;
@use "@/assets/style/component.scss" as component;

.nav__wrapper {
  @include component.container;
  background-color: colors.$neutral-bg-secondary;
  max-width: 100%;

  @media (min-width: 1000px) {
    // padding: 0 12.8rem;
  }
}
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.6rem;
  width: 100%;
  padding: 0.4rem 0;
  margin-bottom: 2.4rem;
  position: relative;

  @media (min-width: 800px) {
    margin-bottom: 3.2rem;
  }

  @media (min-width: 1000px) {
    margin-bottom: 4rem;
  }

  &__right {
    display: flex;
    flex-direction: column;
    // display: none;
    gap: 1.6rem;
    text-align: right;
    padding: 1.6rem;
    background-color: colors.$neutral-bg-secondary;
    z-index: 999;

    position: absolute;
    top: 100%;
    right: 0;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.15s ease-in-out;

    @media (min-width: 800px) {
      flex-direction: row;
      z-index: 0;
      position: relative;
      opacity: 1;
      padding: 0;
      pointer-events: auto;
    }

    &--visible {
      opacity: 1;
      pointer-events: auto;
    }
  }

  &__burger {
    @media (min-width: 800px) {
      display: none;
    }
  }

  .btn {
    background-color: transparent;
  }
}

.nav a.router-link-exact-active {
  color: colors.$accent;
}

.nav__left a:first-of-type {
  color: colors.$neutral-text;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.nav a {
  display: inline-block;
  font-size: 1.4rem;
  padding: 0.4rem 0.8rem;
  color: colors.$neutral-text;
  font-weight: bold;
  border-radius: 7px;

  &:hover {
    background-color: colors.$neutral-bg;
  }
}

.search-bar__wrapper {
  position: relative;
  // width: 10%;
  // max-width: 40rem;
}

.search-bar:focus-within + .results {
  opacity: 1;
  pointer-events: auto;
}

.results {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: colors.$neutral-bg-secondary;
  border-radius: 7px;
  padding: 1.6rem;
  z-index: 999;
  box-shadow: 0 0 0.4rem 0.1rem rgba(0, 0, 0, 0.1);

  transition: opacity 0.15s ease-in-out;
  opacity: 0;
  pointer-events: none;
}
</style>
