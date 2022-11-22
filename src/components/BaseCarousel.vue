<script setup lang="ts">
import { ref } from "vue";
import IconArrowLeft from "./icons/IconArrowLeft.vue";
import IconArrowRight from "./icons/IconArrowRight.vue";

const props = defineProps({
  slides: {
    type: Number,
    default: 0,
  },
});

const currentSlide = ref(1);

const nextSlide = () => {
  currentSlide.value === props.slides
    ? (currentSlide.value = 1)
    : currentSlide.value++;
};

const previousSlide = () => {
  currentSlide.value === 1
    ? (currentSlide.value = props.slides)
    : currentSlide.value--;
};

const goToSlide = (slide: number) => {
  currentSlide.value = slide;
};
</script>

<template>
  from props {{ props.slides }} current slide {{ currentSlide }}
  <div class="carousel">
    <div class="carousel__content">
      <button @click="previousSlide()" class="btn">
        <IconArrowLeft></IconArrowLeft>
      </button>
      <slot :currentSlide="currentSlide"></slot>
      <button @click="nextSlide()" class="btn">
        <IconArrowRight></IconArrowRight>
      </button>
    </div>
    <div class="carousel__navigation"></div>

    <div class="carousel__pagination">
      <span
        v-for="(slide, index) in props.slides"
        :key="index"
        :class="{ active: currentSlide === index + 1 }"
        @click="goToSlide(index + 1)"
      >
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/style/colors.scss" as colors;
@use "@/assets/style/component.scss" as component;
.carousel {
  // @include component.container;
  // padding: 0 6rem;
  // position: relative;
  // height: 100%;

  &__content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    height: 100%;
  }
  .carousel__navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 5%;
    right: 5%;

    .btn {
      background: none;
      border: none;
      width: 3.6rem;
      height: 3.6rem;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 50%;
      transition: all 0.2s ease-in-out;
      &:hover {
        background: colors.$accent;
      }
    }
  }

  .carousel__pagination {
    display: flex;
    gap: 0.8rem;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);

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
