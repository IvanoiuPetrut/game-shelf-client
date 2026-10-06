import { defineGameListStore } from "@/stores/game-list";
import { addDays, isoDate } from "@/utils/format";

// The most anticipated games releasing in the next three months
export const useGamesUpcomingStore = defineGameListStore(
  "gamesUpcoming",
  () => ({
    ordering: "-added",
    page_size: 12,
    dates: `${isoDate(addDays(new Date(), 1))},${isoDate(addDays(new Date(), 90))}`,
  }),
);
