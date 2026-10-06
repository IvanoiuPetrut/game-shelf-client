<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useScrollLock, watchDebounced } from "@vueuse/core";
import { usePagedGames } from "@/composables/usePagedGames";
import GameCard from "@/components/GameCard.vue";
import GameFilters from "@/components/GameFilters.vue";
import BaseSearchBar from "@/components/BaseSearchBar.vue";
import ChipTag from "@/components/ui/ChipTag.vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import SkeletonBlock from "@/components/ui/SkeletonBlock.vue";
import InfiniteSentinel from "@/components/ui/InfiniteSentinel.vue";

const props = defineProps<{
  category: string;
}>();

type GroupKey = "genres" | "platforms" | "tags" | "stores";

const FILTER_GROUPS: {
  key: GroupKey;
  label: string;
  options: { value: string; name: string }[];
}[] = [
  {
    key: "genres",
    label: "Genres",
    options: [
      { value: "action", name: "Action" },
      { value: "adventure", name: "Adventure" },
      { value: "role-playing-games-rpg", name: "RPG" },
      { value: "indie", name: "Indie" },
      { value: "strategy", name: "Strategy" },
      { value: "shooter", name: "Shooter" },
      { value: "casual", name: "Casual" },
      { value: "puzzle", name: "Puzzle" },
      { value: "arcade", name: "Arcade" },
      { value: "platformer", name: "Platformer" },
      { value: "racing", name: "Racing" },
      { value: "sports", name: "Sports" },
    ],
  },
  {
    key: "platforms",
    label: "Platforms",
    options: [
      { value: "4", name: "PC" },
      { value: "187", name: "PlayStation 5" },
      { value: "18", name: "PlayStation 4" },
      { value: "186", name: "Xbox Series S/X" },
      { value: "1", name: "Xbox One" },
      { value: "7", name: "Nintendo Switch" },
      { value: "5", name: "macOS" },
      { value: "6", name: "Linux" },
    ],
  },
  {
    key: "tags",
    label: "Tags",
    options: [
      { value: "31", name: "Singleplayer" },
      { value: "7", name: "Multiplayer" },
      { value: "18", name: "Co-op" },
      { value: "36", name: "Open World" },
      { value: "13", name: "Atmospheric" },
      { value: "42", name: "Great Soundtrack" },
    ],
  },
  {
    key: "stores",
    label: "Stores",
    options: [
      { value: "1", name: "Steam" },
      { value: "5", name: "GOG" },
      { value: "11", name: "Epic Games" },
      { value: "3", name: "PlayStation Store" },
      { value: "2", name: "Xbox Store" },
      { value: "6", name: "Nintendo Store" },
    ],
  },
];

const ORDERINGS = [
  { value: "", label: "Relevance" },
  { value: "-metacritic", label: "Metascore" },
  { value: "-rating", label: "Player rating" },
  { value: "-added", label: "Popularity" },
  { value: "-released", label: "Newest" },
  { value: "released", label: "Oldest" },
  { value: "name", label: "Title (A–Z)" },
  { value: "-name", label: "Title (Z–A)" },
];

const route = useRoute();
const router = useRouter();

const queryString = (value: unknown) =>
  typeof value === "string" ? value : "";

const search = ref(queryString(route.query.search));
const ordering = ref(queryString(route.query.ordering));
const selected = reactive<Record<GroupKey, string[]>>({
  genres: FILTER_GROUPS[0]!.options.some((o) => o.value === props.category)
    ? [props.category]
    : [],
  platforms: [],
  tags: [],
  stores: [],
});

const areFiltersOpen = ref(false);
const bodyLocked = useScrollLock(
  typeof document !== "undefined" ? document.body : null,
);
watch(areFiltersOpen, (open) => (bodyLocked.value = open));

const { games, total, loading, error, hasMore, isEmpty, loadMore, reset } =
  usePagedGames(() => ({
    search: search.value.trim() || null,
    search_precise: search.value.trim() ? true : null,
    ordering: ordering.value || null,
    genres: selected.genres.join(",") || null,
    platforms: selected.platforms.join(",") || null,
    tags: selected.tags.join(",") || null,
    stores: selected.stores.join(",") || null,
  }));

const title = computed(() => {
  if (selected.genres.length === 1) {
    const genre = FILTER_GROUPS[0]!.options.find(
      (o) => o.value === selected.genres[0],
    );
    if (genre) return `${genre.name} games`;
  }
  return "Browse games";
});

const activeFilters = computed(() =>
  FILTER_GROUPS.flatMap((group) =>
    group.options
      .filter((option) => selected[group.key].includes(option.value))
      .map((option) => ({ group: group.key, ...option })),
  ),
);

const isChecked = (group: GroupKey, value: string) =>
  selected[group].includes(value);

const setChecked = (group: GroupKey, value: string, checked: boolean) => {
  selected[group] = checked
    ? [...selected[group], value]
    : selected[group].filter((v) => v !== value);
};

const clearFilters = () => {
  (Object.keys(selected) as GroupKey[]).forEach((key) => (selected[key] = []));
};

// Keep the search and sort in the URL so results can be shared
const syncQuery = () =>
  router.replace({
    query: {
      ...(search.value.trim() && { search: search.value.trim() }),
      ...(ordering.value && { ordering: ordering.value }),
    },
  });

watchDebounced(
  search,
  () => {
    syncQuery();
    reset();
  },
  { debounce: 350 },
);
watch(ordering, () => {
  syncQuery();
  reset();
});
watch(selected, reset, { deep: true });

// The nav search can link here while this page is already open
watch(
  () => route.query.search,
  (value) => {
    if (queryString(value) !== search.value) search.value = queryString(value);
  },
);

onMounted(reset);
</script>

<template>
  <main class="browse page container">
    <header class="browse__header">
      <div>
        <h1 class="browse__title">{{ title }}</h1>
        <p class="browse__count">
          <template v-if="total !== null"
            >{{ total.toLocaleString() }} games</template
          >
          <template v-else>&nbsp;</template>
        </p>
      </div>
      <div class="browse__controls">
        <BaseSearchBar
          v-model="search"
          label="Search by title"
          class="browse__search"
        />
        <label class="sort">
          <span class="visually-hidden">Sort by</span>
          <select v-model="ordering" class="sort__select">
            <option
              v-for="option in ORDERINGS"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </label>
        <button
          class="btn btn--ghost filters-toggle"
          @click="areFiltersOpen = true"
        >
          <AppIcon name="filter" :size="18" /> Filters
          <span v-if="activeFilters.length" class="filters-toggle__count">
            {{ activeFilters.length }}
          </span>
        </button>
      </div>
    </header>

    <div v-if="activeFilters.length > 0" class="active-filters">
      <ChipTag
        v-for="filter in activeFilters"
        :key="`${filter.group}-${filter.value}`"
        as="button"
        active
        :aria-label="`Remove ${filter.name} filter`"
        @click="setChecked(filter.group, filter.value, false)"
      >
        {{ filter.name }} <AppIcon name="x" :size="14" />
      </ChipTag>
      <button class="clear" @click="clearFilters">Clear all</button>
    </div>

    <div class="layout">
      <Transition name="fade">
        <div
          v-if="areFiltersOpen"
          class="scrim"
          aria-hidden="true"
          @click="areFiltersOpen = false"
        ></div>
      </Transition>
      <aside
        class="filters"
        :class="{ 'filters--open': areFiltersOpen }"
        aria-label="Filters"
      >
        <div class="filters__head">
          <h2 class="filters__title">Filters</h2>
          <button
            class="btn btn--ghost btn--icon filters__close"
            aria-label="Close filters"
            @click="areFiltersOpen = false"
          >
            <AppIcon name="x" :size="18" />
          </button>
        </div>
        <fieldset
          v-for="group in FILTER_GROUPS"
          :key="group.key"
          class="filters__group"
        >
          <legend class="filters__legend">{{ group.label }}</legend>
          <GameFilters
            v-for="option in group.options"
            :key="option.value"
            :label="option.name"
            :model-value="isChecked(group.key, option.value)"
            @update:model-value="setChecked(group.key, option.value, $event)"
          />
        </fieldset>
        <button class="btn filters__done" @click="areFiltersOpen = false">
          Show {{ total?.toLocaleString() ?? "" }} games
        </button>
      </aside>

      <section class="results" aria-live="polite">
        <div class="grid">
          <GameCard v-for="game in games" :key="game.id" :game="game" />
          <template v-if="loading">
            <div v-for="n in 6" :key="`skeleton-${n}`">
              <SkeletonBlock height="auto" style="aspect-ratio: 16 / 10" />
              <SkeletonBlock
                width="70%"
                height="1.1rem"
                style="margin-top: 0.9rem"
              />
            </div>
          </template>
        </div>
        <div v-if="isEmpty" class="empty">
          <p class="empty__title">No games found</p>
          <p>Try a different search or remove some filters.</p>
          <button
            v-if="activeFilters.length"
            class="btn btn--ghost"
            @click="clearFilters"
          >
            Clear filters
          </button>
        </div>
        <p v-if="error" class="empty">
          {{ error }}
          <button class="btn btn--ghost" @click="loadMore">Retry</button>
        </p>
        <InfiniteSentinel
          :disabled="loading || !hasMore || !!error"
          @visible="loadMore"
        />
      </section>
    </div>
  </main>
</template>

<style scoped lang="scss">
@use "@/assets/style/mixins.scss" as mixins;

$desktop: 1000px;

.browse__header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1.6rem;
  margin-bottom: 1.6rem;
}

.browse__title {
  font-size: clamp(2.2rem, 1.6rem + 2.6vw, 3.6rem);
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 1.1;
}

.browse__count {
  color: var(--neutral-text-secondary);
}

.browse__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  width: 100%;

  @media (min-width: 750px) {
    width: auto;
  }
}

.browse__search {
  flex: 1;
  min-width: 220px;
}

.sort__select {
  height: 100%;
  padding: 0.6rem 1rem;
  border-radius: 999px;
  border: 1px solid var(--border-glass);
  background: var(--neutral-bg-secondary);
  color: var(--neutral-text);
  font: inherit;
  font-weight: 600;
}

.filters-toggle {
  @media (min-width: $desktop) {
    display: none;
  }
}

.filters-toggle__count {
  display: grid;
  place-items: center;
  min-width: 1.3rem;
  height: 1.3rem;
  border-radius: 999px;
  font-size: 0.75rem;
  background: var(--accent);
}

.active-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.6rem;
}

.clear {
  border: none;
  background: none;
  color: var(--neutral-text-secondary);
  font-weight: 600;
  cursor: pointer;

  &:hover {
    color: var(--neutral-text);
  }
}

.layout {
  display: grid;
  gap: 3.2rem;
  margin-top: 2.4rem;

  @media (min-width: $desktop) {
    grid-template-columns: 220px 1fr;
  }
}

// * Filters: a drawer on small screens, a sidebar on large ones

.filters {
  @include mixins.glass-panel(true);
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: min(86vw, 340px);
  padding: 1.6rem;
  border-radius: 0 var(--r-lg) var(--r-lg) 0;
  overflow-y: auto;
  z-index: 150;
  transform: translateX(-105%);
  transition: transform 0.3s var(--ease-out);

  &--open {
    transform: none;
  }

  @media (min-width: $desktop) {
    position: sticky;
    top: 6.4rem;
    width: auto;
    max-height: calc(100vh - 8rem);
    padding: 0;
    background: none;
    border: none;
    backdrop-filter: none;
    transform: none;
    z-index: 1;
  }
}

.filters__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
}

.filters__title {
  font-size: 1.4rem;
}

.filters__close,
.filters__done {
  @media (min-width: $desktop) {
    display: none;
  }
}

.filters__done {
  width: 100%;
  margin-top: 1rem;
  position: sticky;
  bottom: 0;
}

.filters__group {
  border: none;
  padding: 0;
  margin: 0 0 1.6rem;
}

.filters__legend {
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--neutral-text-secondary);
}

.scrim {
  position: fixed;
  inset: 0;
  background: rgb(0 0 0 / 0.55);
  z-index: 140;

  @media (min-width: $desktop) {
    display: none;
  }
}

// * Results

.results {
  min-width: 0;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 2.4rem 1.6rem;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  padding: 6.4rem 0;
  text-align: center;
  color: var(--neutral-text-secondary);
}

.empty__title {
  font-family: var(--font-display);
  font-size: 1.8rem;
  color: var(--neutral-text);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
