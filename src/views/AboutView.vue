<script setup lang="ts">
import CodeSnippet from "@/components/CodeSnippet.vue";
</script>

<template>
  <div class="about__wrapper">
    <h1>Implementation</h1>
    <CodeSnippet />
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/style/colors.scss" as colors;
@use "@/assets/style/component.scss" as component;

.about__wrapper {
  @include component.container;
}
</style>
