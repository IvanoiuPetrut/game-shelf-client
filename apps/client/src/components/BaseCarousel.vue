<script setup lang="ts">
import { computed, onBeforeUnmount, useTemplateRef, watch } from "vue";
import {
  useDocumentVisibility,
  useElementHover,
  useFocusWithin,
  usePreferredReducedMotion,
  useSwipe,
} from "@vueuse/core";
import AppIcon from "./ui/AppIcon.vue";

const props = withDefaults(
  defineProps<{
    count: number;
    label: string;
    interval?: number;
  }>(),
  { interval: 7000 },
);

const current = defineModel<number>("current", { default: 0 });

const root = useTemplateRef<HTMLElement>("root");
const isHovered = useElementHover(root);
const { focused } = useFocusWithin(root);
const visibility = useDocumentVisibility();
const reducedMotion = usePreferredReducedMotion();

const paused = computed(
  () =>
    isHovered.value ||
    focused.value ||
    visibility.value === "hidden" ||
    reducedMotion.value === "reduce",
);

const go = (index: number) => {
  if (props.count === 0) return;
  current.value = (index + props.count) % props.count;
};
const next = () => go(current.value + 1);
const prev = () => go(current.value - 1);

// Autoplay keeps track of the time left on the current slide, so pausing and
// resuming lines up with the progress bar animation.
let timer: ReturnType<typeof setTimeout> | undefined;
let remaining = props.interval;
let startedAt = 0;

const start = () => {
  clearTimeout(timer);
  if (paused.value || props.count < 2) return;
  startedAt = Date.now();
  timer = setTimeout(next, remaining);
};

const pause = () => {
  clearTimeout(timer);
  remaining = Math.max(0, remaining - (Date.now() - startedAt));
};

watch(
  [current, () => props.count],
  () => {
    remaining = props.interval;
    start();
  },
  { immediate: true },
);
watch(paused, (isPaused) => (isPaused ? pause() : start()));
onBeforeUnmount(() => clearTimeout(timer));

useSwipe(root, {
  threshold: 40,
  onSwipeEnd(_event, direction) {
    if (direction === "left") next();
    if (direction === "right") prev();
  },
});
</script>

<template>
  <section
    ref="root"
    class="carousel"
    aria-roledescription="carousel"
    :aria-label="label"
    @keydown.left.prevent="prev"
    @keydown.right.prevent="next"
  >
    <div class="carousel__viewport">
      <slot :current="current" />
    </div>

    <div v-if="count > 1" class="carousel__controls">
      <button
        class="btn btn--ghost btn--icon"
        aria-label="Previous slide"
        @click="prev"
      >
        <AppIcon name="chevron-left" :size="20" />
      </button>
      <div class="carousel__indicators">
        <button
          v-for="index in count"
          :key="index"
          class="indicator"
          :class="{ 'indicator--active': current === index - 1 }"
          :aria-label="`Go to slide ${index}`"
          :aria-current="current === index - 1"
          @click="go(index - 1)"
        >
          <span
            v-if="current === index - 1"
            class="indicator__fill"
            :style="{
              animationDuration: `${interval}ms`,
              animationPlayState: paused ? 'paused' : 'running',
            }"
          ></span>
        </button>
      </div>
      <button
        class="btn btn--ghost btn--icon"
        aria-label="Next slide"
        @click="next"
      >
        <AppIcon name="chevron-right" :size="20" />
      </button>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.carousel__viewport {
  overflow: hidden;
  border-radius: var(--r-lg);
}

.carousel__controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  margin-top: 1.2rem;
}

.carousel__indicators {
  display: flex;
  gap: 0.5rem;
}

.indicator {
  width: 1.2rem;
  height: 0.35rem;
  padding: 0;
  border: none;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.15);
  overflow: hidden;
  cursor: pointer;
  transition:
    width 0.4s var(--ease-out),
    background-color 0.2s;

  &:hover {
    background: rgb(255 255 255 / 0.3);
  }

  &--active {
    width: 3.2rem;
  }
}

.indicator__fill {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: var(--brand-gradient);
  transform-origin: left;
  animation: fill linear forwards;
}

@media (prefers-reduced-motion: reduce) {
  .indicator__fill {
    animation: none;
  }
}

@keyframes fill {
  from {
    transform: scaleX(0);
  }
}
</style>
