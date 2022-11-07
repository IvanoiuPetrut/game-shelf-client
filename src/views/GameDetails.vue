<script setup lang="ts">
const props = defineProps<{
  id: string;
}>();
</script>

<template>
  <main>
    <h1>Best Game Ever</h1>
    <p>{{ $route.params.id }}</p>
    <p>{{ props.id }}</p>
  </main>
</template>
