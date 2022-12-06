<script setup lang="ts">
const props = defineProps<{
  category: string;
}>();
</script>

<template>
  <h1>Categories</h1>
  <p>{{ props.category }}</p>
</template>
