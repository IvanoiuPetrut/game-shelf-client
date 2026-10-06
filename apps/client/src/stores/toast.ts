import { ref } from "vue";
import { defineStore } from "pinia";
import type { RouteLocationRaw } from "vue-router";

export interface Toast {
  id: number;
  message: string;
  action?: { label: string; to: RouteLocationRaw };
}

const TOAST_DURATION_MS = 3500;

export const useToastStore = defineStore("toast", () => {
  const toasts = ref<Toast[]>([]);
  let nextId = 0;

  const dismiss = (id: number) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  };

  const show = (message: string, action?: Toast["action"]) => {
    const id = nextId++;
    toasts.value = [...toasts.value.slice(-2), { id, message, action }];
    setTimeout(() => dismiss(id), TOAST_DURATION_MS);
  };

  return { toasts, show, dismiss };
});
