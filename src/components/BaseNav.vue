<script setup lang="ts">
import IconBook from "./icons/IconBook.vue";
</script>

<template>
  <nav class="nav">
    <div class="nav__left">
      <RouterLink to="/" class="nav__logo"> <IconBook /> GameShelf </RouterLink>
    </div>
    <div class="nav__right">
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
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.6rem;
  background-color: colors.$neutral-bg-secondary;
  width: 100%;
  padding: 1rem 10.8rem;
  margin-bottom: 6.4rem;

  &__logo {
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }

  &__right {
    display: flex;
    gap: 1.6rem;
  }
}

.nav a.router-link-exact-active {
  color: colors.$accent;
}

.nav__left a:first-of-type {
  color: colors.$primary;
}

.nav a {
  display: inline-block;
  font-size: 1.4rem;
  padding: 0.4rem 0.8rem;
  // border-left: 1px solid colors.$neutral-bg;
  font-weight: bold;
  border-radius: 7px;

  &:hover {
    background-color: colors.$neutral-bg;
  }
}
</style>
