<script setup lang="ts">
import { computed, ref, useTemplateRef } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { onClickOutside, useEventListener, watchDebounced } from "@vueuse/core";
import { listGames } from "@/services/rawg";
import type { GameSummary } from "@/types/rawg";
import { resizedImage } from "@/utils/format";
import BaseSearchBar from "./BaseSearchBar.vue";
import ScoreBadge from "./ui/ScoreBadge.vue";

const router = useRouter();

const query = ref("");
const results = ref<GameSummary[]>([]);
const loading = ref(false);
const open = ref(false);
const activeIndex = ref(-1);

const wrapper = useTemplateRef<HTMLElement>("wrapper");
const searchBar =
  useTemplateRef<InstanceType<typeof BaseSearchBar>>("searchBar");

let controller: AbortController | undefined;

watchDebounced(
  query,
  async (value) => {
    controller?.abort();
    const search = value.trim();
    if (!search) {
      results.value = [];
      loading.value = false;
      return;
    }

    const current = new AbortController();
    controller = current;
    loading.value = true;
    try {
      const data = await listGames(
        { search, page_size: 8, search_precise: true },
        current.signal,
      );
      results.value = data.results;
      activeIndex.value = -1;
      open.value = true;
    } catch (err) {
      if (!axios.isCancel(err)) results.value = [];
    } finally {
      if (controller === current) loading.value = false;
    }
  },
  { debounce: 300 },
);

const showPanel = computed(() => open.value && query.value.trim() !== "");

const close = () => {
  open.value = false;
  activeIndex.value = -1;
};

const reset = () => {
  close();
  query.value = "";
  results.value = [];
};

const goToGame = (game: GameSummary) => {
  reset();
  router.push({ name: "gameDetails", params: { id: game.id } });
};

const searchAll = () => {
  const search = query.value.trim();
  if (!search) return;
  reset();
  router.push({
    name: "category",
    params: { category: "all" },
    query: { search },
  });
};

const onKeydown = (event: KeyboardEvent) => {
  const count = results.value.length;
  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      open.value = true;
      if (count) activeIndex.value = (activeIndex.value + 1) % count;
      break;
    case "ArrowUp":
      event.preventDefault();
      if (count) activeIndex.value = (activeIndex.value - 1 + count) % count;
      break;
    case "Enter": {
      const game = results.value[activeIndex.value];
      if (game) goToGame(game);
      else searchAll();
      break;
    }
    case "Escape":
      close();
      break;
  }
};

onClickOutside(wrapper, close);

// Press "/" anywhere to jump to the search box
useEventListener(window, "keydown", (event: KeyboardEvent) => {
  const target = event.target as HTMLElement;
  const isTyping =
    target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
  if (event.key === "/" && !isTyping) {
    event.preventDefault();
    searchBar.value?.focus();
  }
});
</script>

<template>
  <div ref="wrapper" class="nav-search">
    <BaseSearchBar
      ref="searchBar"
      v-model="query"
      label="Search games"
      shortcut="/"
      role="combobox"
      aria-autocomplete="list"
      aria-controls="nav-search-results"
      :aria-expanded="showPanel"
      :aria-activedescendant="
        activeIndex >= 0 ? `nav-search-${activeIndex}` : undefined
      "
      @focus="open = true"
      @keydown="onKeydown"
    />

    <Transition name="dropdown">
      <div v-if="showPanel" class="panel">
        <p v-if="loading && results.length === 0" class="panel__status">
          Searching…
        </p>
        <p v-else-if="results.length === 0" class="panel__status">
          No games match “{{ query.trim() }}”
        </p>
        <ul v-else id="nav-search-results" role="listbox" class="panel__list">
          <li
            v-for="(game, index) in results"
            :id="`nav-search-${index}`"
            :key="game.id"
            role="option"
            :aria-selected="index === activeIndex"
            class="result"
            :class="{ 'result--active': index === activeIndex }"
            @mouseenter="activeIndex = index"
            @click="goToGame(game)"
          >
            <img
              v-if="game.background_image"
              :src="resizedImage(game.background_image, 200)"
              alt=""
              class="result__img"
              loading="lazy"
            />
            <div v-else class="result__img"></div>
            <div class="result__text">
              <p class="result__name">{{ game.name }}</p>
              <p class="result__meta">
                {{ game.released?.slice(0, 4) ?? "TBA" }}
                <template v-if="game.genres[0]">
                  · {{ game.genres[0].name }}
                </template>
              </p>
            </div>
            <ScoreBadge :score="game.metacritic" size="sm" />
          </li>
        </ul>
        <button v-if="results.length > 0" class="panel__all" @click="searchAll">
          See all results for “{{ query.trim() }}”
        </button>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/style/mixins.scss" as mixins;

.nav-search {
  width: 100%;
}

.panel {
  @include mixins.glass-panel(true);
  position: absolute;
  top: calc(100% + 0.6rem);
  left: 0;
  width: max(100%, min(420px, 92vw));
  max-height: min(70vh, 520px);
  overflow-y: auto;
  padding: 0.5rem;
  box-shadow: var(--shadow-2);
  z-index: 50;
}

.panel__status {
  padding: 1.2rem;
  text-align: center;
  color: var(--neutral-text-secondary);
}

.result {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0.5rem;
  border-radius: var(--r-md);
  cursor: pointer;

  &--active {
    background: rgb(255 255 255 / 0.07);
  }
}

.result__img {
  flex: 0 0 4.4rem;
  height: 2.8rem;
  object-fit: cover;
  border-radius: var(--r-sm);
  background: var(--neutral-bg-secondary);
}

.result__text {
  flex: 1;
  min-width: 0;
}

.result__name {
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result__meta {
  font-size: 0.85rem;
  color: var(--neutral-text-secondary);
}

.panel__all {
  width: 100%;
  margin-top: 0.4rem;
  padding: 0.7rem;
  border: none;
  border-top: 1px solid var(--border-glass);
  background: none;
  color: var(--accent-strong);
  font-weight: 600;
  cursor: pointer;

  &:hover {
    color: var(--neutral-text);
  }
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
