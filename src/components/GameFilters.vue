<script lang="ts" setup>
import { ref } from "vue";

const props = defineProps<{
  label: string;
  modelValue: boolean;
}>();

const valueOfCheckBox = ref(props.modelValue);
</script>

<template>
  <div>
    <div class="form__field">
      <input
        type="checkbox"
        class="form__input"
        v-bind="$attrs"
        :id="label"
        :true-value="true"
        :false-value="false"
        v-model="valueOfCheckBox"
        @input="$emit('update:modelValue', valueOfCheckBox)"
      />
      <label :for="label" class="form__label">{{ label }}</label>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/style/colors.scss" as colors;

.form__field {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.form__input {
  width: 0.8rem;
  height: 0.8rem;
  border: 1px solid colors.$neutral-text-secondary;
  border-radius: 0.2rem;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:checked {
    background-color: colors.$primary;
  }
}
.form__label {
  font-size: 1.2rem;
  &:hover {
    cursor: pointer;
    color: colors.$accent;
  }
}
</style>
