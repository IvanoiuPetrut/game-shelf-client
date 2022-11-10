<script setup lang="ts">
import BaseButton from "./BaseButton.vue";
</script>

<template>
  <section class="hero">
    <div class="hero__section">
      <h1 class="hero__title">Game Shelf</h1>
      <p class="hero__description">
        Best place to track your gamer's journey and find new games to play
      </p>
      <RouterLink to="/register">
        <BaseButton>
          <template #text> Sign Up for Free </template>
        </BaseButton>
      </RouterLink>
    </div>
    <div class="hero__section">
      <div class="bookshelf">
        bookshelf
        <div class="bookshelf_shelf">
          shelf
          <div class="bookshelf__game">game</div>
          <div class="bookshelf__game">game</div>
          <div class="bookshelf__game">game</div>
          <div class="bookshelf__game">game</div>
        </div>
        <div class="bookshelf__game bookshelf__game--big">game big</div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
