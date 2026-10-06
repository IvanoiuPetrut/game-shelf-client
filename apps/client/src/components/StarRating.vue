<script setup lang="ts">
import { ref } from "vue";
import AppIcon from "./ui/AppIcon.vue";

const props = defineProps<{
  modelValue: number | null;
  readonly?: boolean;
  size?: number;
}>();
const emit = defineEmits<{ "update:modelValue": [value: number | null] }>();

const hovered = ref<number | null>(null);

// Clicking the current rating again clears it
const select = (value: number) =>
  emit("update:modelValue", props.modelValue === value ? null : value);
</script>

<template>
  <span
    v-if="readonly"
    class="stars"
    :aria-label="`Rated ${modelValue ?? 0} out of 5`"
  >
    <AppIcon
      v-for="n in 5"
      :key="n"
      name="star"
      :size="size ?? 14"
      :filled="n <= (modelValue ?? 0)"
      class="star"
      :class="{ 'star--on': n <= (modelValue ?? 0) }"
    />
  </span>
  <div
    v-else
    class="stars"
    role="radiogroup"
    aria-label="Your rating"
    @mouseleave="hovered = null"
  >
    <button
      v-for="n in 5"
      :key="n"
      class="star star--button"
      :class="{ 'star--on': n <= (hovered ?? modelValue ?? 0) }"
      role="radio"
      :aria-checked="modelValue === n"
      :aria-label="`${n} star${n > 1 ? 's' : ''}`"
      @mouseenter="hovered = n"
      @click="select(n)"
    >
      <AppIcon
        name="star"
        :size="size ?? 22"
        :filled="n <= (hovered ?? modelValue ?? 0)"
      />
    </button>
  </div>
</template>

<style lang="scss" scoped>
.stars {
  display: inline-flex;
  gap: 0.15rem;
}

.star {
  color: rgb(255 255 255 / 0.25);
  transition:
    color 0.15s,
    transform 0.15s;

  &--on {
    color: var(--warning);
    filter: drop-shadow(0 0 6px rgb(250 204 21 / 0.4));
  }

  &--button {
    display: grid;
    padding: 0.15rem;
    border: none;
    background: none;
    cursor: pointer;

    &:hover {
      transform: scale(1.15);
    }
  }
}
</style>
