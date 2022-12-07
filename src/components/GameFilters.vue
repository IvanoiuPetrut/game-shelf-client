<script lang="ts" setup>
import { ref, computed } from "vue";

defineProps({
  label: {
    type: String,
    default: "",
  },
  modelValue: {
    type: [String, Number],
    default: "",
  },
  isChecked: {
    type: Boolean,
    default: false,
  },
});

const valueOfCheckbox = ref<any>(1);
</script>

<template>
  <div>
    <div class="form__field">
      <label :for="label" class="form__label">{{ label }}</label>
      <input
        type="checkbox"
        class="form__input"
        v-bind="$attrs"
        :id="label"
        true-value="1"
        false-value="0"
        v-model="valueOfCheckbox"
        @input="$emit('update:modelValue', valueOfCheckbox)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
