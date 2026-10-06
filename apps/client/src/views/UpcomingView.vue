<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { usePagedGames } from "@/composables/usePagedGames";
import { addDays, isoDate } from "@/utils/format";
import type { GameSummary } from "@/types/rawg";
import GameCard from "@/components/GameCard.vue";
import ChipTag from "@/components/ui/ChipTag.vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import SkeletonBlock from "@/components/ui/SkeletonBlock.vue";
import InfiniteSentinel from "@/components/ui/InfiniteSentinel.vue";

const PLATFORMS = [
  { id: null, name: "All platforms" },
  { id: 4, name: "PC" },
  { id: 187, name: "PlayStation 5" },
  { id: 186, name: "Xbox Series S/X" },
  { id: 7, name: "Nintendo Switch" },
];

const ORDERINGS = [
  { value: "-added", label: "Most anticipated" },
  { value: "released", label: "Release date" },
];

const platform = ref<number | null>(null);
const ordering = ref("-added");

const { games, loading, error, hasMore, loadMore, reset } = usePagedGames(
  () => ({
    dates: `${isoDate(addDays(new Date(), 1))},${isoDate(addDays(new Date(), 180))}`,
    ordering: ordering.value,
    platforms: platform.value,
  }),
);

const monthFormatter = new Intl.DateTimeFormat("en-GB", {
  month: "long",
  year: "numeric",
});

// Games grouped into a timeline by release month
const months = computed(() => {
  const groups = new Map<string, GameSummary[]>();
  [...games.value]
    .filter((game) => game.released && game.background_image)
    .sort((a, b) => a.released!.localeCompare(b.released!))
    .forEach((game) => {
      const key = game.released!.slice(0, 7);
      groups.set(key, [...(groups.get(key) ?? []), game]);
    });
  return [...groups].map(([key, items]) => ({
    key,
    label: monthFormatter.format(new Date(`${key}-01T00:00:00`)),
    games: items,
  }));
});

watch([platform, ordering], reset);
onMounted(reset);
</script>

<template>
  <main class="upcoming page container">
    <header class="upcoming__header">
      <span class="eyebrow"
        ><AppIcon name="calendar" :size="16" /> Next six months</span
      >
      <h1 class="upcoming__title">Upcoming releases</h1>
      <p class="upcoming__subtitle">
        What's coming out soon, grouped by month. Bookmark anything you don't
        want to miss.
      </p>
    </header>

    <div class="filters">
      <div class="filters__group" role="group" aria-label="Platform">
        <ChipTag
          v-for="item in PLATFORMS"
          :key="item.name"
          as="button"
          :active="platform === item.id"
          @click="platform = item.id"
        >
          {{ item.name }}
        </ChipTag>
      </div>
      <div class="filters__group" role="group" aria-label="Order">
        <ChipTag
          v-for="item in ORDERINGS"
          :key="item.value"
          as="button"
          :active="ordering === item.value"
          @click="ordering = item.value"
        >
          {{ item.label }}
        </ChipTag>
      </div>
    </div>

    <ol class="timeline">
      <li v-for="month in months" :key="month.key" class="month">
        <h2 class="month__label">
          <span class="month__dot"></span>{{ month.label }}
          <span class="month__count">{{ month.games.length }}</span>
        </h2>
        <div class="month__grid">
          <GameCard
            v-for="game in month.games"
            :key="game.id"
            :game="game"
            countdown
          />
        </div>
      </li>
    </ol>

    <div v-if="loading" class="month__grid">
      <SkeletonBlock
        v-for="n in 4"
        :key="n"
        height="auto"
        style="aspect-ratio: 16 / 10"
      />
    </div>
    <p v-if="error" class="status">
      {{ error }}
      <button class="btn btn--ghost" @click="loadMore">Retry</button>
    </p>
    <p v-else-if="!loading && months.length === 0" class="status">
      No upcoming releases found for this platform.
    </p>
    <p v-else-if="!hasMore && months.length > 0" class="status">
      That's everything for the next six months.
    </p>
    <InfiniteSentinel
      :disabled="loading || !hasMore || !!error"
      @visible="loadMore"
    />
  </main>
</template>

<style lang="scss" scoped>
.upcoming__header {
  margin-bottom: 2.4rem;
}

.upcoming__title {
  font-size: clamp(2.4rem, 1.6rem + 3vw, 4rem);
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 1.1;
}

.upcoming__subtitle {
  margin-top: 0.6rem;
  max-width: 52ch;
  color: var(--neutral-text-secondary);
}

.filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 3.2rem;
}

.filters__group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.timeline {
  list-style: none;
  padding: 0 0 0 1.6rem;
  border-left: 2px solid var(--border-glass);

  @media (min-width: 768px) {
    padding-left: 2.4rem;
  }
}

.month {
  margin-bottom: 4.8rem;
}

.month__label {
  position: sticky;
  top: 5rem;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1.6rem;
  padding: 0.4rem 1.2rem 0.4rem 0;
  font-size: clamp(1.3rem, 1rem + 1vw, 1.8rem);
  background: linear-gradient(90deg, var(--neutral-bg) 70%, transparent);
}

.month__dot {
  position: absolute;
  left: calc(-1.6rem - 7px);
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: var(--glow-accent);

  @media (min-width: 768px) {
    left: calc(-2.4rem - 7px);
  }
}

.month__count {
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 700;
  padding: 0 0.6rem;
  border-radius: 999px;
  background: var(--accent-transparent);
  color: var(--accent-strong);
}

.month__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 2.4rem 1.6rem;
}

.status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3.2rem 0;
  text-align: center;
  color: var(--neutral-text-secondary);
}
</style>
