<script setup lang="ts">
import { ref } from "vue";
import { useScroll } from "@vueuse/core";
import type { RouteLocationRaw } from "vue-router";
import AppIcon from "./AppIcon.vue";

defineProps<{
  title: string;
  subtitle?: string;
  to?: RouteLocationRaw;
}>();

const track = ref<HTMLElement | null>(null);
const { arrivedState } = useScroll(track);

const scroll = (direction: 1 | -1) => {
  if (!track.value) return;
  track.value.scrollBy({
    left: direction * track.value.clientWidth * 0.85,
    behavior: "smooth",
  });
};
</script>

<template>
  <section class="rail container">
    <header class="rail__header">
      <div>
        <h2 class="rail__title">{{ title }}</h2>
        <p v-if="subtitle" class="rail__subtitle">{{ subtitle }}</p>
      </div>
      <div class="rail__actions">
        <RouterLink v-if="to" :to="to" class="rail__more">
          See all <AppIcon name="arrow-right" :size="16" />
        </RouterLink>
        <div class="rail__arrows">
          <button
            class="btn btn--ghost btn--icon"
            :disabled="arrivedState.left"
            aria-label="Scroll left"
            @click="scroll(-1)"
          >
            <AppIcon name="chevron-left" :size="20" />
          </button>
          <button
            class="btn btn--ghost btn--icon"
            :disabled="arrivedState.right"
            aria-label="Scroll right"
            @click="scroll(1)"
          >
            <AppIcon name="chevron-right" :size="20" />
          </button>
        </div>
      </div>
    </header>
    <div ref="track" class="rail__track">
      <slot />
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@/assets/style/mixins.scss" as mixins;

.rail {
  margin-bottom: clamp(3.2rem, 6vw, 6.4rem);
}

.rail__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1.2rem;
  margin-bottom: 1.2rem;
}

.rail__title {
  @include mixins.section-title;
}

.rail__subtitle {
  color: var(--neutral-text-secondary);
}

.rail__actions {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.rail__more {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: 600;
  white-space: nowrap;
}

.rail__arrows {
  display: none;
  gap: 0.6rem;

  @media (hover: hover) and (min-width: 768px) {
    display: flex;
  }
}

.rail__track {
  --rail-item-width: clamp(220px, 70vw, 300px);

  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: var(--rail-item-width);
  gap: 1.6rem;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: 0;
  padding: 0.8rem 0.4rem 1.6rem;
  margin: -0.8rem -0.4rem -1.6rem;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  > :slotted(*) {
    scroll-snap-align: start;
  }

  @media (min-width: 1200px) {
    --rail-item-width: calc((100% - 3 * 1.6rem) / 4);
  }
}
</style>
