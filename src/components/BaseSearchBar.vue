<script setup lang="ts">
import IconSearchNormal from "@/components/icons/IconSearchNormal.vue";
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

defineEmits(["update:modelValue", "focus"]);
</script>

<template>
  <div class="input__wrapper">
    <input
      class="game__input"
      type="text"
      v-bind="$attrs"
      :placeholder="label"
      :value="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
    />
    <IconSearchNormal class="icon" />
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/style/colors.scss" as colors;

.input__wrapper {
  position: relative;
}

.game__input {
  width: 100%;
  padding: 0.6rem 0.6rem 0.6rem 2.4rem;
  border-radius: 100px;
  border: 2px solid colors.$neutral-text-secondary;
  background-color: colors.$neutral-bg-secondary;
  color: colors.$neutral-text;
  font-size: 1rem;
  transition: all 0.3s ease-in-out;

  &::placeholder {
    color: colors.$neutral-text-secondary;
  }

  &:focus {
    outline: none;
    border: 2px solid colors.$accent;
  }

  &:focus ~ .icon {
    color: colors.$accent;
  }

  @media (min-width: 750px) {
    width: 150%;
  }
}

.icon {
  position: absolute;
  bottom: 50%;
  transform: translateY(50%);
  left: 0.6rem;
  color: colors.$neutral-text-secondary;
  z-index: 999;

  transition: all 0.3s ease-in-out;
}
</style>
