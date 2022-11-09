<script setup lang="ts">
defineProps({
  label: {
    type: String,
    default: "button",
  },
  onClick: {
    type: Function,
    default: () => {},
  },
});
</script>

<template>
  <button>{{ label }}</button>
</template>
