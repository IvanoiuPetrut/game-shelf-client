<script setup lang="ts">
import { computed, nextTick, useTemplateRef, watch } from "vue";
import { useEventListener, useScrollLock, useSwipe } from "@vueuse/core";
import AppIcon from "./ui/AppIcon.vue";

const props = defineProps<{ images: string[] }>();

// The index of the open image, or null when the lightbox is closed
const index = defineModel<number | null>("index", { default: null });

const stage = useTemplateRef<HTMLElement>("stage");
const closeButton = useTemplateRef<HTMLButtonElement>("closeButton");
const scrollLock = useScrollLock(
  typeof document !== "undefined" ? document.body : null,
);

const isOpen = computed(() => index.value !== null);
const image = computed(() =>
  index.value === null ? undefined : props.images[index.value],
);

const close = () => (index.value = null);
const step = (delta: number) => {
  if (index.value === null) return;
  index.value =
    (index.value + delta + props.images.length) % props.images.length;
};

watch(isOpen, async (open) => {
  scrollLock.value = open;
  if (open) {
    await nextTick();
    closeButton.value?.focus();
  }
});

useEventListener(window, "keydown", (event: KeyboardEvent) => {
  if (!isOpen.value) return;
  if (event.key === "Escape") close();
  if (event.key === "ArrowRight") step(1);
  if (event.key === "ArrowLeft") step(-1);
});

useSwipe(stage, {
  onSwipeEnd(_event, direction) {
    if (direction === "left") step(1);
    if (direction === "right") step(-1);
  },
});
</script>

<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div
        v-if="isOpen"
        class="lightbox"
        role="dialog"
        aria-modal="true"
        aria-label="Screenshot viewer"
        @click.self="close"
      >
        <button
          ref="closeButton"
          class="lightbox__close btn btn--ghost btn--icon"
          aria-label="Close"
          @click="close"
        >
          <AppIcon name="x" />
        </button>
        <button
          v-if="images.length > 1"
          class="lightbox__nav lightbox__nav--prev btn btn--ghost btn--icon"
          aria-label="Previous screenshot"
          @click="step(-1)"
        >
          <AppIcon name="chevron-left" />
        </button>
        <div ref="stage" class="lightbox__stage" @click.self="close">
          <Transition name="swap" mode="out-in">
            <img :key="image" :src="image" alt="" class="lightbox__img" />
          </Transition>
        </div>
        <button
          v-if="images.length > 1"
          class="lightbox__nav lightbox__nav--next btn btn--ghost btn--icon"
          aria-label="Next screenshot"
          @click="step(1)"
        >
          <AppIcon name="chevron-right" />
        </button>
        <p class="lightbox__counter">
          {{ (index ?? 0) + 1 }} / {{ images.length }}
        </p>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 300;
  display: grid;
  place-items: center;
  background: rgb(5 5 10 / 0.88);
  backdrop-filter: blur(16px);
}

.lightbox__stage {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  padding: 4.8rem 1.6rem;

  @media (min-width: 768px) {
    padding: 4.8rem 6.4rem;
  }
}

.lightbox__img {
  max-width: 100%;
  max-height: 100%;
  border-radius: var(--r-md);
  box-shadow: var(--shadow-2);
}

.lightbox__close {
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  z-index: 1;
}

.lightbox__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;

  &--prev {
    left: 1.2rem;
  }

  &--next {
    right: 1.2rem;
  }
}

.lightbox__counter {
  position: absolute;
  bottom: 1.2rem;
  left: 50%;
  transform: translateX(-50%);
  color: var(--neutral-text-secondary);
  font-weight: 600;
}

.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.25s;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

.swap-enter-active,
.swap-leave-active {
  transition:
    opacity 0.15s,
    transform 0.15s;
}

.swap-enter-from,
.swap-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>
