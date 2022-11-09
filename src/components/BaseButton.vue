<script setup lang="ts">
defineProps({
  onClick: {
    type: Function,
    default: () => {},
  },
});
</script>

<template>
  <button @click="onClick()" class="btn">
    <slot name="text">Button</slot>
  </button>
</template>
