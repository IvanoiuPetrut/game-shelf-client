<script setup lang="ts">
import { ref, watch } from "vue";
import { useElementVisibility } from "@vueuse/core";

// Emits `visible` while it's near the viewport and not disabled, so a list
// keeps loading pages until it fills the screen.
const props = defineProps<{ disabled?: boolean }>();
const emit = defineEmits<{ visible: [] }>();

const target = ref<HTMLElement | null>(null);
const isVisible = useElementVisibility(target, { rootMargin: "600px 0px" });

watch([isVisible, () => props.disabled], ([visible, disabled]) => {
  if (visible && !disabled) emit("visible");
});
</script>

<template>
  <div ref="target" class="sentinel" aria-hidden="true"></div>
</template>

<style scoped>
.sentinel {
  height: 1px;
}
</style>
