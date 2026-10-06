<script setup lang="ts">
import { computed, ref, useTemplateRef } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTransition } from "@vueuse/core";
import {
  SHELF_STATUSES,
  statusLabel,
  useShelfStore,
  type ShelfEntry,
  type ShelfStatus,
} from "@/stores/shelf";
import { useToastStore } from "@/stores/toast";
import GameCard from "@/components/GameCard.vue";
import StarRating from "@/components/StarRating.vue";
import AppIcon from "@/components/ui/AppIcon.vue";

type Tab = ShelfStatus | "all";
type Sort = "updated" | "rating" | "title" | "metacritic";

const shelf = useShelfStore();
const toast = useToastStore();

const route = useRoute();
const router = useRouter();

// The selected tab lives in the URL so links like "View shelf" can open it
const tab = computed<Tab>({
  get: () => {
    const status = route.query.status;
    return SHELF_STATUSES.some((s) => s.value === status)
      ? (status as ShelfStatus)
      : "all";
  },
  set: (value) =>
    router.replace({ query: value === "all" ? {} : { status: value } }),
});
const sort = ref<Sort>("updated");
const fileInput = useTemplateRef<HTMLInputElement>("fileInput");

const tabs = computed(() => [
  { value: "all" as Tab, label: "All", count: shelf.count },
  ...SHELF_STATUSES.map((s) => ({
    value: s.value as Tab,
    label: s.label,
    count: shelf.counts[s.value],
  })),
]);

const SORTERS: Record<Sort, (a: ShelfEntry, b: ShelfEntry) => number> = {
  updated: (a, b) => b.updatedAt.localeCompare(a.updatedAt),
  rating: (a, b) => (b.rating ?? 0) - (a.rating ?? 0),
  title: (a, b) => a.name.localeCompare(b.name),
  metacritic: (a, b) => (b.metacritic ?? 0) - (a.metacritic ?? 0),
};

const games = computed(() => {
  const list = tab.value === "all" ? shelf.list : shelf.byStatus(tab.value);
  return [...list].sort(SORTERS[sort.value]);
});

// Count up the stats when the page opens
const animated = (source: () => number) =>
  useTransition(source, { duration: 900, transition: [0.2, 0.7, 0.2, 1] });
const total = animated(() => shelf.stats.total);
const completionRate = animated(() => shelf.stats.completionRate);
const hours = animated(() => shelf.stats.hours);

const exportShelf = () => {
  const blob = new Blob([shelf.exportJson()], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `game-shelf-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

const importShelf = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  try {
    const imported = shelf.importJson(await file.text());
    toast.show(`Imported ${imported} game${imported === 1 ? "" : "s"}`);
  } catch {
    toast.show("That file isn't a Game Shelf export");
  } finally {
    input.value = "";
  }
};
</script>

<template>
  <main class="shelf page container">
    <header class="shelf__header">
      <div>
        <span class="eyebrow"
          ><AppIcon name="bookmark" :size="16" /> Your library</span
        >
        <h1 class="shelf__title">My Shelf</h1>
        <p class="shelf__subtitle">
          Everything you're playing, have finished or want to play next. Your
          shelf is saved in this browser.
        </p>
      </div>
      <div class="shelf__io">
        <button
          class="btn btn--ghost"
          :disabled="shelf.count === 0"
          @click="exportShelf"
        >
          <AppIcon name="download" :size="18" /> Export
        </button>
        <button class="btn btn--ghost" @click="fileInput?.click()">
          <AppIcon name="upload" :size="18" /> Import
        </button>
        <input
          ref="fileInput"
          type="file"
          accept="application/json,.json"
          class="visually-hidden"
          tabindex="-1"
          @change="importShelf"
        />
      </div>
    </header>

    <template v-if="shelf.count > 0">
      <section class="stats" aria-label="Shelf stats">
        <div class="stat">
          <p class="stat__value">{{ Math.round(total) }}</p>
          <p class="stat__label">Games on shelf</p>
        </div>
        <div class="stat">
          <p class="stat__value">{{ Math.round(completionRate) }}%</p>
          <p class="stat__label">Completed</p>
          <div class="stat__bar">
            <span :style="{ width: `${completionRate}%` }"></span>
          </div>
        </div>
        <div class="stat">
          <p class="stat__value">{{ Math.round(hours) }}h</p>
          <p class="stat__label">Played through (est.)</p>
        </div>
        <div class="stat">
          <p class="stat__value stat__value--text">
            {{ shelf.stats.topGenre }}
          </p>
          <p class="stat__label">Favourite genre</p>
        </div>
      </section>

      <div class="toolbar">
        <div class="tabs" role="tablist" aria-label="Filter by status">
          <button
            v-for="item in tabs"
            :key="item.value"
            role="tab"
            class="tab"
            :class="{ 'tab--active': tab === item.value }"
            :aria-selected="tab === item.value"
            @click="tab = item.value"
          >
            {{ item.label }} <span class="tab__count">{{ item.count }}</span>
          </button>
        </div>
        <label class="sort">
          <span>Sort by</span>
          <select v-model="sort" class="sort__select">
            <option value="updated">Recently updated</option>
            <option value="rating">Your rating</option>
            <option value="metacritic">Metascore</option>
            <option value="title">Title</option>
          </select>
        </label>
      </div>

      <TransitionGroup
        v-if="games.length > 0"
        tag="div"
        name="grid"
        class="grid"
      >
        <GameCard v-for="game in games" :key="game.id" :game="game">
          <template #overlay>
            <span class="ribbon" :class="`ribbon--${game.status}`">
              {{ statusLabel(game.status) }}
            </span>
          </template>
          <template #eyebrow>
            <StarRating
              v-if="game.rating"
              :model-value="game.rating"
              readonly
            />
            <span v-else>Not rated</span>
          </template>
        </GameCard>
      </TransitionGroup>
      <p v-else class="empty-tab">
        Nothing marked as {{ statusLabel(tab as ShelfStatus) }} yet.
      </p>
    </template>

    <section v-else class="empty">
      <div class="empty__art" aria-hidden="true">
        <span></span><span></span><span></span>
        <div class="empty__plank"></div>
      </div>
      <h2>Your shelf is empty</h2>
      <p>
        Tap the bookmark on any game to save it here, then track whether you're
        playing it, have finished it or dropped it.
      </p>
      <div class="empty__actions">
        <RouterLink
          :to="{ name: 'category', params: { category: 'all' } }"
          class="btn btn--lg"
        >
          Browse games
        </RouterLink>
        <RouterLink :to="{ name: 'surprise' }" class="btn btn--lg btn--ghost">
          <AppIcon name="dice" :size="18" /> Surprise me
        </RouterLink>
      </div>
    </section>
  </main>
</template>

<style lang="scss" scoped>
@use "@/assets/style/mixins.scss" as mixins;

.shelf__header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1.6rem;
  margin-bottom: 3.2rem;
}

.shelf__title {
  font-size: clamp(2.4rem, 1.6rem + 3vw, 4rem);
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 1.1;
}

.shelf__subtitle {
  margin-top: 0.6rem;
  max-width: 52ch;
  color: var(--neutral-text-secondary);
}

.shelf__io {
  display: flex;
  gap: 0.8rem;
}

// * Stats

.stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.2rem;
  margin-bottom: 3.2rem;

  @media (min-width: 900px) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.stat {
  @include mixins.glass-panel;
  padding: 1.4rem 1.6rem;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: auto -30% -60% auto;
    width: 70%;
    aspect-ratio: 1;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      var(--accent-transparent),
      transparent 70%
    );
  }
}

.stat__value {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 1.4rem + 1.6vw, 2.6rem);
  font-weight: 700;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;

  &--text {
    font-size: clamp(1.3rem, 1rem + 1vw, 1.8rem);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.stat__label {
  color: var(--neutral-text-secondary);
  font-size: 0.9rem;
}

.stat__bar {
  height: 4px;
  margin-top: 0.6rem;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.1);

  span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: var(--success);
  }
}

// * Toolbar

.toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 2.4rem;
}

.tabs {
  display: flex;
  gap: 0.4rem;
  padding: 0.3rem;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.04);
  border: 1px solid var(--border-glass);
  overflow-x: auto;
  max-width: 100%;
  scrollbar-width: none;
}

.tab {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 1rem;
  border: none;
  border-radius: 999px;
  background: none;
  color: var(--neutral-text-secondary);
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background-color 0.2s,
    color 0.2s;

  &:hover {
    color: var(--neutral-text);
  }

  &--active {
    background: var(--accent);
    color: white;
    box-shadow: var(--glow-accent);

    &:hover {
      color: white;
    }
  }
}

.tab__count {
  font-size: 0.8rem;
  opacity: 0.75;
}

.sort {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--neutral-text-secondary);
}

.sort__select {
  padding: 0.5rem 0.9rem;
  border-radius: 999px;
  border: 1px solid var(--border-glass);
  background: var(--neutral-bg-secondary);
  color: var(--neutral-text);
  font: inherit;
  font-weight: 600;
}

// * Grid

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 2.4rem 1.6rem;
}

.ribbon {
  position: absolute;
  top: 0.7rem;
  left: 0.7rem;
  padding: 0.15rem 0.7rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--neutral-bg);
  background: var(--accent-strong);

  &--playing {
    background: var(--cyan);
  }

  &--completed {
    background: var(--success);
  }

  &--dropped {
    background: var(--neutral-text-secondary);
  }
}

.grid-move,
.grid-enter-active,
.grid-leave-active {
  transition:
    opacity 0.35s,
    transform 0.35s var(--ease-out);
}

.grid-enter-from,
.grid-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.grid-leave-active {
  position: absolute;
}

.empty-tab {
  padding: 4.8rem 0;
  text-align: center;
  color: var(--neutral-text-secondary);
}

// * Empty state

.empty {
  @include mixins.glass-panel;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4.8rem 2rem;
  text-align: center;

  p {
    max-width: 48ch;
    color: var(--neutral-text-secondary);
  }
}

.empty__art {
  display: flex;
  align-items: flex-end;
  gap: 0.6rem;
  height: 7rem;
  margin-bottom: 1.2rem;

  span {
    width: 2.6rem;
    height: 5.2rem;
    border-radius: 6px;
    border: 2px dashed rgb(255 255 255 / 0.18);
    animation: wobble 3s ease-in-out infinite;

    &:nth-child(2) {
      height: 6rem;
      animation-delay: -1s;
    }

    &:nth-child(3) {
      height: 4.4rem;
      animation-delay: -2s;
    }
  }
}

.empty__plank {
  position: absolute;
  left: -1.6rem;
  right: -1.6rem;
  bottom: -0.8rem;
  height: 6px;
  border-radius: 999px;
  background: var(--brand-gradient);
  box-shadow: var(--glow-accent);
}

.empty__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.2rem;
}

@keyframes wobble {
  50% {
    transform: translateY(-6px) rotate(-2deg);
  }
}
</style>
