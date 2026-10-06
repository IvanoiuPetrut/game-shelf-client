<script setup lang="ts">
defineProps<{
  width?: string;
  height?: string;
  radius?: string;
}>();
</script>

<template>
  <div
    class="skeleton"
    aria-hidden="true"
    :style="{
      width: width ?? '100%',
      height: height ?? '1rem',
      borderRadius: radius ?? 'var(--r-md)',
    }"
  ></div>
</template>

<style scoped>
.skeleton {
  overflow: hidden;
  background: var(--neutral-bg-secondary);
}

.skeleton::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(
    90deg,
    transparent,
    rgb(255 255 255 / 0.05),
    transparent
  );
  animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
  to {
    transform: translateX(100%);
  }
}
</style>
