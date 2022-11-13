<script setup lang="ts">
import { ref } from "vue";

const currentSlide = ref(2);
</script>

<template>
  Carousel
  <div class="carousel">
    <slot :currentSlide="currentSlide"></slot>

    <div class="carousel__navigation">
      <button>Left</button>
      <button>Right</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.carousel {
  position: relative;
  height: 100%;

  .carousel__navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    right: 0;
  }
}
</style>
