import { ref } from "vue";
import { defineStore } from "pinia";
import { listGames } from "@/services/rawg";
import type { GameSummary, QueryParams } from "@/types/rawg";

// Builds a store holding one curated list of games, fetched once per session.
export const defineGameListStore = (id: string, params: () => QueryParams) =>
  defineStore(id, () => {
    const games = ref<GameSummary[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const fetchGames = async (force = false) => {
      if (loading.value || (games.value.length > 0 && !force)) return;
      loading.value = true;
      error.value = null;
      try {
        const data = await listGames(params());
        games.value = data.results;
      } catch {
        error.value = "Couldn't load these games.";
      } finally {
        loading.value = false;
      }
    };

    return { games, loading, error, fetchGames };
  });
