<script setup lang="ts">
import IconBook from "./icons/IconBook.vue";
</script>

<template>
  <nav class="nav">
    <RouterLink to="/"> <IconBook /> GameShelf </RouterLink>
    <router-link :to="{ name: 'register' }">Register</router-link>
    <!-- <router-link :to="{ name: 'login' }">Login</router-link> -->
    <router-link :to="{ name: 'about' }">About</router-link>
  </nav>
</template>

<style lang="scss" scoped>
@use "@/assets/style/colors.scss" as colors;
.nav {
  width: 100%;
  background-color: colors.$neutral-bg-secondary;
  padding: 1rem 0;
}

nav a.router-link-exact-active {
  color: colors.$accent;
}

nav a.router-link-exact-active:hover {
  // background-color: colors.$accent-transparent;
}

nav a {
  display: inline-block;
  font-size: 1.2rem;
  padding: 0.4rem 0.8rem;
  // border-left: 1px solid colors.$neutral-bg;
  font-weight: bold;
  border-radius: 7px;

  &:hover {
    background-color: colors.$neutral-bg;
  }
}

nav a:first-of-type {
  border: 0;
}
</style>
