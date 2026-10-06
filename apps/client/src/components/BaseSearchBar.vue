<script setup lang="ts">
import { ref } from "vue";
import AppIcon from "./ui/AppIcon.vue";

defineOptions({ inheritAttrs: false });

defineProps<{ label: string; shortcut?: string }>();
const model = defineModel<string>({ default: "" });

const input = ref<HTMLInputElement | null>(null);
defineExpose({ focus: () => input.value?.focus() });
</script>

<template>
  <div class="search">
    <AppIcon name="search" :size="18" class="search__icon" />
    <input
      ref="input"
      v-model="model"
      v-bind="$attrs"
      class="search__input"
      type="search"
      :placeholder="label"
      :aria-label="label"
      autocomplete="off"
    />
    <kbd v-if="shortcut && !model" class="search__kbd">{{ shortcut }}</kbd>
  </div>
</template>

<style lang="scss" scoped>
.search {
  display: flex;
  align-items: center;
}

.search__input {
  width: 100%;
  padding: 0.6rem 2.4rem 0.6rem 2.6rem;
  border-radius: 999px;
  border: 1px solid var(--border-glass);
  background: rgb(255 255 255 / 0.05);
  color: var(--neutral-text);
  font: inherit;
  font-size: 1rem;
  transition:
    border-color 0.2s,
    background-color 0.2s,
    box-shadow 0.2s;

  &::placeholder {
    color: var(--neutral-text-secondary);
  }

  &::-webkit-search-cancel-button {
    display: none;
  }

  &:focus {
    outline: none;
    border-color: var(--accent);
    background: rgb(255 255 255 / 0.08);
    box-shadow: 0 0 0 4px var(--accent-transparent);
  }
}

.search__icon {
  position: absolute;
  left: 0.9rem;
  color: var(--neutral-text-secondary);
  pointer-events: none;
  z-index: 1;
}

.search:focus-within .search__icon {
  color: var(--accent-strong);
}

.search__kbd {
  position: absolute;
  right: 0.9rem;
  padding: 0 0.45rem;
  border-radius: 6px;
  border: 1px solid var(--border-glass);
  font-family: inherit;
  font-size: 0.8rem;
  color: var(--neutral-text-secondary);
  pointer-events: none;
}
</style>
