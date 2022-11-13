<script setup lang="ts">
import { ref, onMounted } from "vue";

const currentSlide = ref(1);
const slideCount = ref(0);

onMounted(() => {
  slideCount.value = document.querySelectorAll(".slide").length;
});

const nextSlide = () => {
  currentSlide.value === slideCount.value
    ? (currentSlide.value = 1)
    : currentSlide.value++;
};

const previousSlide = () => {
  currentSlide.value === 1
    ? (currentSlide.value = slideCount.value)
    : currentSlide.value--;
};
</script>

<template>
  Carousel
  <div class="carousel">
    <slot :currentSlide="currentSlide"></slot>

    <div class="carousel__navigation">
      <button @click="previousSlide()">Left</button>
      <button @click="nextSlide()">Right</button>
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
