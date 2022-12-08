<script lang="ts" setup>
import { ref } from "vue";

const props = defineProps<{
  label: string;
  modelValue: boolean;
  // isCheckbox: {
  //   type: boolean;
  //   default: false;
  // };
}>();

const valueOfCheckBox = ref(props.modelValue);
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
        :true-value="true"
        :false-value="false"
        v-model="valueOfCheckBox"
        @input="$emit('update:modelValue', valueOfCheckBox)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
