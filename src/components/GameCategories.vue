<script setup lang="ts">
const categories = ["action", "indie", "strategy", "casual"];
</script>

<template>
  <div class="categories__wrapper">
    <h2>Browse by category</h2>
    <div class="categories">
      <router-link
        class="category"
        v-for="(category, index) in categories"
        :key="index"
        :to="{ name: 'category', params: { category } }"
      >
        <div class="overlay"></div>
        <img
          :src="`/assets/images/${category}.webp`"
          alt="category image"
          class="category__img"
          width="200"
        />
        <p class="category__name">
          {{ category }}
        </p>
      </router-link>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/style/colors.scss" as colors;
@use "@/assets/style/component.scss" as component;

.categories__wrapper {
  @include component.container;
}
.categories {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.6rem;
  height: 30vh;

  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 900px) {
    gap: 2.4rem;
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.category {
  border-radius: 7px;
  transition: all 0.3s ease;
  overflow: hidden;
  // hover
  &:hover {
    .category__img {
      transform: scale(1.05);
    }

    .overlay {
      bottom: -100px;
    }
  }

  .overlay {
    background: colors.$accent-gradient;
    border-radius: 7px;
    z-index: 9;
    width: 100%;
    height: 100%;
    position: absolute;
    bottom: 0;
    transition: all 0.3s ease;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 7px;
    position: relative;
    transition: all 0.3s ease;
  }

  &__name {
    font-size: 1.4rem;
    text-transform: uppercase;
    text-align: center;
    color: colors.$neutral-text;
    font-weight: 600;
    letter-spacing: 0.1rem;
    position: absolute;
    bottom: 5%;
    left: 0;
    width: 100%;
    z-index: 99;
  }

  @media (min-width: 600px) {
    &:nth-child(1) {
      justify-self: end;
    }
    &:nth-child(2) {
      justify-self: start;
    }
    &:nth-child(3) {
      justify-self: end;
    }
    &:nth-child(4) {
      justify-self: start;
    }

    @media (min-width: 1200px) {
      &:nth-child(1),
      &:nth-child(2),
      &:nth-child(3),
      &:nth-child(4) {
        width: 90%;
        justify-self: center;
      }
    }
  }

  @media (min-width: 900px) {
    width: 70%;
    // padding: 0.6rem 0;
  }
}

h2 {
  margin-bottom: 2.4rem;
}
</style>
