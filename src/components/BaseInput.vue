<script setup lang="ts">
defineProps({
  label: {
    type: String,
    default: "",
  },
  modelValue: {
    type: [String, Number],
    default: "",
  },
});
</script>

<template>
  <div class="form__field">
    <label :for="label" class="form__label">{{ label }}</label>
    <input
      v-bind="$attrs"
      :id="label"
      :placeholder="label"
      class="form__input"
      :value="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
    />
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/style/colors.scss" as colors;

.form__field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1.2rem;
}

.form__label {
  font-size: 1.2rem;
  color: colors.$neutral-text-secondary;
}

.form__input {
  padding: 0.4rem 0.8rem;
  border: 1px solid colors.$neutral-text-secondary;
  background-color: colors.$neutral-bg-secondary;
  border-radius: 7px;
  font-size: 1.4rem;
  color: currentColor;

  &:focus {
    outline: none;
    border-color: colors.$primary;
  }
}
</style>
