import { ref } from "vue";
import { defineStore } from "pinia";

// The art shown, blurred, behind the whole page
export const useBackdropStore = defineStore("backdrop", () => {
  const image = ref<string | null>(null);

  const set = (url: string | null | undefined) => {
    image.value = url ?? null;
  };

  return { image, set };
});
