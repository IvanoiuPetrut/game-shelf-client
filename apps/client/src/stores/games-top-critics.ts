import { defineGameListStore } from "@/stores/game-list";
import { isoDate } from "@/utils/format";

export const useGamesTopCriticsStore = defineGameListStore(
  "gamesTopCritics",
  () => ({
    ordering: "-metacritic",
    page_size: 12,
    exclude_additions: true,
    dates: `${new Date().getFullYear() - 5}-01-01,${isoDate(new Date())}`,
  }),
);
