<script setup lang="ts">
import { ref } from "vue";
import IconBook from "./icons/IconBook.vue";
import IconMenu from "./icons/IconMenu.vue";

const isMobileNavVisible = ref(false);

const toggleMobileNav = () => {
  isMobileNavVisible.value = !isMobileNavVisible.value;
  console.log(isMobileNavVisible.value);
};
</script>

<template>
  <nav class="nav">
    <div class="nav__left">
      <RouterLink to="/" class="nav__logo"> <IconBook /> GameShelf </RouterLink>
    </div>
    <button class="nav__burger btn" @click="toggleMobileNav">
      <IconMenu />
    </button>
    <div
      class="nav__right"
      :class="{ 'nav__right--visible': isMobileNavVisible }"
    >
      <router-link :to="{ name: 'category', params: { category: 'default' } }">
        Categories
      </router-link>
      <router-link :to="{ name: 'about' }">About</router-link>
      <router-link :to="{ name: 'register' }">Register</router-link>

      <!-- <router-link :to="{ name: 'login' }">Login</router-link> -->
    </div>
  </nav>
</template>

<style lang="scss" scoped>
@use "@/assets/style/colors.scss" as colors;
@use "@/assets/style/component.scss" as component;
.nav {
  @include component.container;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.6rem;
  background-color: colors.$neutral-bg-secondary;
  width: 100%;
  // padding: 1rem 10.8rem;
  margin-bottom: 2.4rem;
  position: relative;

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

    &--visible {
      opacity: 1;
      pointer-events: auto;
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
</style>
