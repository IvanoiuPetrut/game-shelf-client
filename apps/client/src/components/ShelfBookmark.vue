<script setup lang="ts">
import { computed } from "vue";
import { useShelfStore, statusLabel } from "@/stores/shelf";
import { useToastStore } from "@/stores/toast";
import type { GameBasics } from "@/types/rawg";
import AppIcon from "./ui/AppIcon.vue";

// One-click "save for later" button shown on game cards.
const props = defineProps<{ game: GameBasics }>();

const shelf = useShelfStore();
const toast = useToastStore();

const entry = computed(() => shelf.get(props.game.id));

const label = computed(() =>
  entry.value
    ? `On your shelf (${statusLabel(entry.value.status)}). Click to remove`
    : `Add ${props.game.name} to your wishlist`,
);

const toggle = () => {
  if (entry.value) {
    shelf.remove(props.game.id);
    toast.show(`Removed ${props.game.name} from your shelf`);
  } else {
    shelf.upsert(props.game, "wishlist");
    toast.show(`Added ${props.game.name} to your wishlist`, {
      label: "View shelf",
      to: { name: "shelf" },
    });
  }
};
</script>

<template>
  <button
    class="bookmark"
    :class="entry && `bookmark--${entry.status}`"
    :aria-pressed="!!entry"
    :aria-label="label"
    :title="label"
    @click.prevent.stop="toggle"
  >
    <AppIcon name="bookmark" :filled="!!entry" :size="18" />
  </button>
</template>

<style scoped lang="scss">
.bookmark {
  display: grid;
  place-items: center;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 50%;
  border: 1px solid var(--border-glass);
  background: rgb(11 11 18 / 0.6);
  backdrop-filter: blur(10px);
  color: var(--neutral-text);
  cursor: pointer;
  transition:
    transform 0.2s,
    background-color 0.2s,
    color 0.2s;

  &:hover {
    transform: scale(1.1);
    background: var(--accent);
  }

  &[aria-pressed="true"] {
    animation: pop 0.35s var(--ease-out);
  }

  &--wishlist {
    color: var(--accent-strong);
  }

  &--playing {
    color: var(--cyan);
  }

  &--completed {
    color: var(--success);
  }

  &--dropped {
    color: var(--neutral-text-secondary);
  }
}

@keyframes pop {
  50% {
    transform: scale(1.25);
  }
}
</style>
