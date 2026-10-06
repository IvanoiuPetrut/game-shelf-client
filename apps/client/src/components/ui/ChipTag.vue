<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";

defineProps<{
  to?: RouteLocationRaw;
  active?: boolean;
  as?: "span" | "button";
}>();
</script>

<template>
  <RouterLink v-if="to" :to="to" class="chip chip--interactive">
    <slot />
  </RouterLink>
  <component
    :is="as ?? 'span'"
    v-else
    class="chip"
    :class="{ 'chip--interactive': as === 'button', 'chip--active': active }"
    :type="as === 'button' ? 'button' : undefined"
    :aria-pressed="as === 'button' ? active : undefined"
  >
    <slot />
  </component>
</template>

<style scoped lang="scss">
.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.8rem;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--neutral-text);
  background: rgb(255 255 255 / 0.06);
  border: 1px solid var(--border-glass);
  white-space: nowrap;
  transition:
    background-color 0.2s,
    border-color 0.2s,
    color 0.2s;

  &--interactive {
    cursor: pointer;

    &:hover {
      color: var(--neutral-text);
      background: rgb(255 255 255 / 0.12);
      border-color: rgb(255 255 255 / 0.18);
    }
  }

  &--active {
    background: var(--accent-transparent);
    border-color: var(--accent);
    color: var(--accent-strong);
  }
}
</style>
