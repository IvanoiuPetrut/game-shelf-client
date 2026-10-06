<script setup lang="ts">
import { computed } from "vue";
import {
  SHELF_STATUSES,
  statusLabel,
  useShelfStore,
  type ShelfStatus,
} from "@/stores/shelf";
import { useToastStore } from "@/stores/toast";
import type { GameBasics } from "@/types/rawg";
import StarRating from "./StarRating.vue";
import AppIcon from "./ui/AppIcon.vue";

const props = defineProps<{ game: GameBasics }>();

const shelf = useShelfStore();
const toast = useToastStore();

const entry = computed(() => shelf.get(props.game.id));

const setStatus = (status: ShelfStatus) => {
  const isNew = !entry.value;
  shelf.upsert(props.game, status);
  toast.show(
    isNew
      ? `Added to your shelf as ${statusLabel(status)}`
      : `Moved to ${statusLabel(status)}`,
    { label: "View shelf", to: { name: "shelf", query: { status } } },
  );
};

const remove = () => {
  shelf.remove(props.game.id);
  toast.show(`Removed ${props.game.name} from your shelf`);
};
</script>

<template>
  <div class="shelf-control">
    <p class="shelf-control__label">
      <AppIcon name="bookmark" :size="16" :filled="!!entry" />
      {{ entry ? "On your shelf" : "Add to your shelf" }}
    </p>
    <div class="statuses" role="group" aria-label="Shelf status">
      <button
        v-for="status in SHELF_STATUSES"
        :key="status.value"
        class="status"
        :class="[
          `status--${status.value}`,
          { 'status--active': entry?.status === status.value },
        ]"
        :aria-pressed="entry?.status === status.value"
        @click="setStatus(status.value)"
      >
        {{ status.label }}
      </button>
    </div>
    <Transition name="expand">
      <div v-if="entry" class="shelf-control__extra">
        <StarRating
          :model-value="entry.rating"
          @update:model-value="shelf.setRating(game.id, $event)"
        />
        <button class="shelf-control__remove" @click="remove">
          <AppIcon name="trash" :size="16" /> Remove
        </button>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/style/mixins.scss" as mixins;

.shelf-control {
  @include mixins.glass-panel;
  display: grid;
  gap: 0.9rem;
  padding: 1.2rem;
  width: min(100%, 520px);
}

.shelf-control__label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--neutral-text-secondary);
}

.statuses {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;

  @media (min-width: 500px) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.status {
  --tone: var(--accent-strong);

  padding: 0.6rem 0.4rem;
  border-radius: var(--r-md);
  border: 1px solid var(--border-glass);
  background: rgb(255 255 255 / 0.04);
  color: var(--neutral-text);
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.2s,
    border-color 0.2s,
    box-shadow 0.2s;

  &:hover {
    border-color: var(--tone);
  }

  &--playing {
    --tone: var(--cyan);
  }

  &--completed {
    --tone: var(--success);
  }

  &--dropped {
    --tone: var(--neutral-text-secondary);
  }

  &--active {
    border-color: var(--tone);
    background: color-mix(in srgb, var(--tone) 22%, transparent);
    box-shadow: 0 0 18px color-mix(in srgb, var(--tone) 35%, transparent);
  }
}

.shelf-control__extra {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.shelf-control__remove {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border: none;
  background: none;
  color: var(--neutral-text-secondary);
  font-weight: 600;
  cursor: pointer;

  &:hover {
    color: var(--error);
  }
}

.expand-enter-active,
.expand-leave-active {
  transition: opacity 0.2s;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
}
</style>
