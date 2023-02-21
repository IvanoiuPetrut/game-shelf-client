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
const showResults = ref(true);

const hideResults = () => {
  showResults.value = false;
};

const toggleMobileNav = () => {
  isMobileNavVisible.value = !isMobileNavVisible.value;
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
    });
};

watch(gameQuery, () => {
  fetchGames();
});
</script>

<template>
  <div class="nav__wrapper">
    <RouterLink to="/" class="nav__logo">
      <IconBook class="icon" /> <span class="desktop-only">GameShelf</span>
    </RouterLink>

    <div class="search-bar__wrapper">
      <BaseSeachBar
        v-model="gameQuery"
        label="Search for games"
        class="search-bar"
        @focus="showResults = true"
      />
      <ul v-if="games.length > 0" class="results" v-show="showResults">
        <li
          v-for="game in games"
          :key="game.id"
          class="results__item"
          @click="hideResults"
        >
          <router-link :to="{ name: 'gameDetails', params: { id: game.id } }">
            <div class="game">
              <img :src="game.background_image" alt="" />
              <div class="game__details">
                <p class="game__name">
                  {{ game.name }}
                </p>
                <p class="game__rating">
                  {{ game.metacritic }}
                </p>
              </div>
            </div>
          </router-link>
        </li>
      </ul>
    </div>

    <button
      aria-controls="primary-nav"
      class="nav__burger"
      @click="toggleMobileNav"
    >
      <IconMenu class="icon" />
    </button>

    <nav
      ref="inner_nav"
      class="nav"
      :class="{ 'nav--visible': isMobileNavVisible }"
    >
      <ul id="primary-nav">
        <li>
          <router-link to="/" @click="toggleMobileNav">Home</router-link>
        </li>
        <li>
          <router-link
            :to="{ name: 'category', params: { category: 'default' } }"
            @click="toggleMobileNav"
          >
            Categories
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'about' }" @click="toggleMobileNav"
            >About</router-link
          >
        </li>
        <li>
          <router-link :to="{ name: 'register' }" @click="toggleMobileNav"
            >Register</router-link
          >
        </li>
      </ul>
    </nav>
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/style/colors.scss" as colors;
@use "@/assets/style/component.scss" as component;

.desktop-only {
  display: none;

  @media (min-width: 768px) {
    display: block;
  }
}
.nav__wrapper {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 0.8rem 1.2rem;
  background-color: colors.$neutral-bg-secondary;

  @media (min-width: 768px) {
    gap: 2rem;
    padding: 0.8rem 3.2rem;
  }

  @media (min-width: 1024px) {
    gap: 3.2rem;
    padding: 0.8rem 4.8rem;
  }

  @media (min-width: 1336px) {
    justify-content: space-between;
  }
}

.nav {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: min(80%, 400px);
  z-index: 999;
  background: colors.$neutral-gradient;
  backdrop-filter: blur(10px);
  padding: 6.4rem 1.2rem;

  transform: translateX(100%);
  transition: transform 0.2s ease-in-out;

  @media (min-width: 1336px) {
    position: static;
    padding: 0;
    width: auto;
    height: auto;
    background: none;
    transform: translateX(0);
  }

  ul {
    @media (min-width: 1336px) {
      display: flex;
      gap: 1.2rem;
    }
  }

  li:not(:last-child) {
    margin-bottom: 1.2rem;
    @media (min-width: 1336px) {
      margin-bottom: 0;
    }
  }

  &--visible {
    transform: translateX(0);
  }
}
.nav__logo {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 1.6rem;
  color: colors.$neutral-text;

  &:hover {
    color: colors.$accent;
  }

  .icon {
    width: 2rem;
    height: 2rem;
    fill: colors.$accent;
  }
}

.nav a::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: colors.$accent;
  border-radius: 7px;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.2s ease-in-out;
}

.nav a:hover::before {
  transform: scaleX(1);
}
.nav a {
  display: inline-block;
  font-size: 1.4rem;
  padding: 0.4rem 0.8rem;
  color: colors.$neutral-text;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
  border-radius: 7px;

  @media (min-width: 1336px) {
    font-size: 1.2rem;
  }
}

.nav a.router-link-exact-active {
  color: colors.$accent;
}

.nav__burger {
  z-index: 1000;
  background-color: transparent;
  position: fixed;
  right: 1.2rem;
  color: colors.$neutral-text;
  border: none;
  padding: 0.4rem;
  cursor: pointer;

  @media (min-width: 1336px) {
    display: none;
  }

  .icon {
    width: 2rem;
    height: 2rem;
  }
}

.search-bar__wrapper {
  position: relative;
  width: min(100%, 200px);
  margin-right: 3.6rem;

  @media (min-width: 1336px) {
    margin-right: auto;
  }
}

.search-bar:focus-within + .results,
.results:focus-within {
  opacity: 1;
  pointer-events: auto;
}

.results {
  position: absolute;
  top: 100%;
  height: min(50vh, 400px);
  overflow-y: auto;
  left: 50%;
  transform: translateX(-50%);
  background-color: colors.$neutral-bg-secondary;
  border-radius: 7px;
  padding: 1.2rem 0.6rem;
  z-index: 999;
  box-shadow: 0 0 0.4rem 0.1rem rgba(0, 0, 0, 0.1);
  border: 2px solid colors.$accent-transparent;

  transition: opacity 0.15s ease-in-out;
  opacity: 0;
  pointer-events: none;

  @media (min-width: 750px) {
    width: 300px;
    left: 75%;
  }

  @media (min-width: 1100px) {
    width: 400px;
    left: 80%;
  }
}

.results__item > a {
  font-size: 1rem;
  font-weight: 400;
  width: 100%;
  color: colors.$neutral-text-secondary;
  padding: 0.4rem 0.6rem;

  &:hover {
    color: colors.$neutral-text;
  }
}

.game {
  display: flex;
  gap: 1.6rem;
}

.game > img {
  flex: 0 0 6.4rem;
  align-self: center;
  width: 6.4rem;
  height: 3.6rem;
  object-fit: cover;
  border-radius: 3px;
}

.game__details {
  display: flex;
  flex-direction: column;
}

.game__name {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  width: 100%;
}

.game__rating {
  color: colors.$accent;
  background-color: colors.$accent-transparent;
  padding: 0rem 0.6rem;
  border: 1px solid colors.$accent;
  border-radius: 7px;
  align-self: flex-start;
}

.game__rating:empty {
  display: none;
}
</style>
