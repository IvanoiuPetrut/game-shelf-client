<script setup lang="ts">
const categories = ["co-op", "action", "rpg", "jrpg"];
</script>

<template>
  <div class="categories__wrapper">
    <h2>Browse by category</h2>
    <div class="categories">
      <router-link
        class="btn category"
        v-for="(category, index) in categories"
        :key="index"
        :to="{ name: 'category', params: { category } }"
      >
        {{ category }}
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
  font-size: 1.4rem;
  text-align: center;
  letter-spacing: 0.1rem;
  text-transform: uppercase;
  width: 80%;
  justify-self: center;

  a {
    color: colors.$neutral-text;
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
    padding: 0.6rem 0;
  }
}

h2 {
  margin-bottom: 2.4rem;
}
</style>
