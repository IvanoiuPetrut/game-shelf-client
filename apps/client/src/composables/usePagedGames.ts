import { computed, ref } from "vue";
import axios from "axios";
import { listGames } from "@/services/rawg";
import type { GameSummary, QueryParams } from "@/types/rawg";

const PAGE_SIZE = 20;

// Loads a RAWG game listing page by page, for infinite scrolling lists.
// Calling `reset` starts over with the current params and drops any request
// still in flight, so results from stale filters never land.
export const usePagedGames = (params: () => QueryParams) => {
  const games = ref<GameSummary[]>([]);
  const total = ref<number | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const page = ref(0);
  const hasMore = ref(true);
  let controller: AbortController | undefined;

  const loadMore = async () => {
    if (loading.value || !hasMore.value) return;
    const current = new AbortController();
    controller = current;
    loading.value = true;
    error.value = null;

    try {
      const data = await listGames(
        { ...params(), page: page.value + 1, page_size: PAGE_SIZE },
        current.signal,
      );
      page.value++;
      games.value = [...games.value, ...data.results];
      total.value = data.count;
      hasMore.value = data.next !== null;
    } catch (err) {
      if (axios.isCancel(err)) return;
      error.value = "Couldn't load games. Please try again.";
    } finally {
      if (controller === current) loading.value = false;
    }
  };

  const reset = () => {
    controller?.abort();
    games.value = [];
    total.value = null;
    page.value = 0;
    hasMore.value = true;
    loading.value = false;
    return loadMore();
  };

  const isEmpty = computed(
    () => !loading.value && !error.value && games.value.length === 0,
  );

  return { games, total, loading, error, hasMore, isEmpty, loadMore, reset };
};
