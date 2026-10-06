<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import AppIcon from "./ui/AppIcon.vue";

const toast = useToastStore();
</script>

<template>
  <div class="toasts" role="status" aria-live="polite">
    <TransitionGroup name="toast">
      <div v-for="item in toast.toasts" :key="item.id" class="toast">
        <AppIcon name="check" :size="18" class="toast__icon" />
        <span class="toast__message">{{ item.message }}</span>
        <RouterLink
          v-if="item.action"
          :to="item.action.to"
          class="toast__action"
          @click="toast.dismiss(item.id)"
        >
          {{ item.action.label }}
        </RouterLink>
      </div>
    </TransitionGroup>
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/style/mixins.scss" as mixins;

.toasts {
  position: fixed;
  bottom: 1.6rem;
  left: 50%;
  transform: translateX(-50%);
  display: grid;
  gap: 0.6rem;
  width: min(92vw, 440px);
  z-index: 200;
  pointer-events: none;
}

.toast {
  @include mixins.glass-panel(true);
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1.2rem;
  border-radius: var(--r-md);
  box-shadow: var(--shadow-2);
  pointer-events: auto;
}

.toast__icon {
  color: var(--success);
}

.toast__message {
  flex: 1;
}

.toast__action {
  font-weight: 700;
  white-space: nowrap;
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s var(--ease-out);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.96);
}
</style>
