<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  score: number | null | undefined;
  size?: "sm" | "md" | "lg";
}>();

const tone = computed(() => {
  const score = props.score ?? 0;
  if (score >= 75) return "good";
  if (score >= 50) return "mixed";
  return "bad";
});
</script>

<template>
  <span
    v-if="score"
    class="score"
    :class="[`score--${tone}`, `score--${size ?? 'md'}`]"
    :title="`Metascore ${score}`"
  >
    {{ score }}
  </span>
</template>

<style scoped lang="scss">
.score {
  display: inline-grid;
  place-items: center;
  font-family: var(--font-display);
  font-weight: 700;
  line-height: 1;
  border-radius: var(--r-sm);
  border: 1px solid currentColor;
  backdrop-filter: blur(8px);

  &--good {
    color: var(--success);
    background: rgb(52 211 153 / 0.14);
  }

  &--mixed {
    color: var(--warning);
    background: rgb(250 204 21 / 0.14);
  }

  &--bad {
    color: var(--error);
    background: rgb(248 113 113 / 0.14);
  }

  &--sm {
    font-size: 0.8rem;
    padding: 0.25rem 0.4rem;
  }

  &--md {
    font-size: 1rem;
    min-width: 2.2rem;
    padding: 0.35rem 0.5rem;
  }

  &--lg {
    font-size: 1.6rem;
    min-width: 3.6rem;
    padding: 0.6rem 0.7rem;
    border-radius: var(--r-md);
  }
}
</style>
