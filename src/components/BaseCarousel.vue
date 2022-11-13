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

const goToSlide = (slide: number) => {
  currentSlide.value = slide;
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

    <div class="carousel__pagination">
      <span
        v-for="(slide, index) in slideCount"
        :key="index"
        :class="{ active: currentSlide === index + 1 }"
        @click="goToSlide(index + 1)"
      >
        <!-- {{ slide }} -->
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/style/colors.scss" as colors;
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

  .carousel__pagination {
    display: flex;
    justify-content: center;
    gap: 0.8rem;

    span {
      width: min(3vw, 1.6rem);
      height: min(0.5rem, 5vw);
      border-radius: 100px;
      background-color: colors.$neutral-bg-secondary;
      cursor: pointer;

      &:hover {
        box-shadow: colors.$primary 0px 0px 0px 3px;
      }

      &.active {
        background-color: colors.$accent;
      }
    }
  }
}
</style>
