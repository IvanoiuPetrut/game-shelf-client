<script lang="ts" setup>
import { useId } from "vue";
import AppIcon from "./ui/AppIcon.vue";

defineProps<{ label: string }>();
const checked = defineModel<boolean>({ default: false });

const id = useId();
</script>

<template>
  <div class="field">
    <input :id="id" v-model="checked" type="checkbox" class="field__input" />
    <label :for="id" class="field__label">
      <span class="field__box" aria-hidden="true">
        <AppIcon name="check" :size="12" />
      </span>
      {{ label }}
    </label>
  </div>
</template>

<style scoped lang="scss">
.field__input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.field__label {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.25rem 0;
  color: var(--neutral-text-secondary);
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: var(--neutral-text);
  }
}

.field__box {
  display: grid;
  place-items: center;
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 5px;
  border: 1.5px solid rgb(255 255 255 / 0.25);
  color: transparent;
  transition:
    background-color 0.2s,
    border-color 0.2s,
    color 0.2s;
}

.field__input:checked + .field__label {
  color: var(--neutral-text);

  .field__box {
    background: var(--accent);
    border-color: var(--accent);
    color: white;
  }
}

.field__input:focus-visible + .field__label .field__box {
  outline: 2px solid var(--accent-strong);
  outline-offset: 2px;
}
</style>
