import { defineGameListStore } from "@/stores/game-list";
import { randomInt } from "@/utils/format";

// A different handful of well-reviewed games on every visit
export const useGamesRandomStore = defineGameListStore("Random", () => ({
  metacritic: "80,100",
  ordering: "-added",
  page: randomInt(1, 8),
  page_size: 8,
  exclude_additions: true,
}));
