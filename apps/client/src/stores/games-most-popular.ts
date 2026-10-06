import { defineGameListStore } from "@/stores/game-list";
import { addDays, isoDate } from "@/utils/format";

// The games most added to RAWG libraries over the past year
export const useGamesMostPopularStore = defineGameListStore(
  "MostPopular",
  () => ({
    ordering: "-added",
    page_size: 12,
    exclude_additions: true,
    dates: `${isoDate(addDays(new Date(), -365))},${isoDate(new Date())}`,
  }),
);
