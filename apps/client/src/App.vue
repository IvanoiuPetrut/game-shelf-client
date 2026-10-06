<script setup lang="ts">
import { RouterView } from "vue-router";
import { useBackdropStore } from "@/stores/backdrop";
import { resizedImage } from "@/utils/format";
import BaseNav from "./components/BaseNav.vue";
import BaseFooter from "./components/BaseFooter.vue";
import ToastHost from "./components/ToastHost.vue";

const backdrop = useBackdropStore();
</script>

<template>
  <div class="ambient" aria-hidden="true">
    <div class="ambient__orb ambient__orb--violet"></div>
    <div class="ambient__orb ambient__orb--cyan"></div>
    <Transition name="ambient-fade">
      <img
        v-if="backdrop.image"
        :key="backdrop.image"
        :src="resizedImage(backdrop.image, 420)"
        alt=""
        class="ambient__art"
      />
    </Transition>
  </div>

  <BaseNav />

  <RouterView v-slot="{ Component, route }">
    <Transition name="page" mode="out-in">
      <component :is="Component" :key="route.path" class="view" />
    </Transition>
  </RouterView>

  <BaseFooter />
  <ToastHost />
</template>

<style lang="scss" scoped>
.view {
  flex: 1;
}

.ambient {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgb(11 11 18 / 0.3) 0%,
      var(--neutral-bg) 85%
    );
  }
}

.ambient__art {
  position: absolute;
  inset: -10%;
  width: 120%;
  height: 120%;
  object-fit: cover;
  filter: blur(70px) saturate(160%);
  opacity: 0.45;
}

.ambient__orb {
  position: absolute;
  width: 60vmax;
  height: 60vmax;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.22;
  animation: drift 24s ease-in-out infinite alternate;

  &--violet {
    background: var(--accent);
    top: -30vmax;
    left: -20vmax;
  }

  &--cyan {
    background: var(--cyan);
    opacity: 0.1;
    top: 10vmax;
    right: -35vmax;
    animation-delay: -12s;
  }
}

@keyframes drift {
  to {
    transform: translate(8vmax, 6vmax) scale(1.1);
  }
}

.ambient-fade-enter-active,
.ambient-fade-leave-active {
  transition: opacity 1.2s ease;
}

.ambient-fade-enter-from,
.ambient-fade-leave-to {
  opacity: 0;
}

.page-enter-active,
.page-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.page-leave-to {
  opacity: 0;
}
</style>
