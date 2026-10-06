import { computed } from "vue";
import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import type { GameBasics } from "@/types/rawg";

export type ShelfStatus = "playing" | "completed" | "wishlist" | "dropped";

export const SHELF_STATUSES: { value: ShelfStatus; label: string }[] = [
  { value: "playing", label: "Playing" },
  { value: "completed", label: "Completed" },
  { value: "wishlist", label: "Wishlist" },
  { value: "dropped", label: "Dropped" },
];

export const statusLabel = (status: ShelfStatus) =>
  SHELF_STATUSES.find((s) => s.value === status)?.label ?? status;

export interface ShelfEntry extends GameBasics {
  playtime: number;
  status: ShelfStatus;
  rating: number | null;
  addedAt: string;
  updatedAt: string;
}

const isShelfEntry = (value: unknown): value is ShelfEntry => {
  const entry = value as ShelfEntry;
  return (
    typeof entry?.id === "number" &&
    typeof entry.name === "string" &&
    SHELF_STATUSES.some((s) => s.value === entry.status)
  );
};

// The user's game library. It lives only in this browser's localStorage.
export const useShelfStore = defineStore("shelf", () => {
  const entries = useLocalStorage<Record<string, ShelfEntry>>(
    "game-shelf:shelf",
    {},
  );

  const list = computed(() =>
    Object.values(entries.value).sort((a, b) =>
      b.updatedAt.localeCompare(a.updatedAt),
    ),
  );

  const count = computed(() => list.value.length);

  const counts = computed(() => {
    const result: Record<ShelfStatus, number> = {
      playing: 0,
      completed: 0,
      wishlist: 0,
      dropped: 0,
    };
    list.value.forEach((entry) => result[entry.status]++);
    return result;
  });

  const stats = computed(() => {
    const total = list.value.length;
    const finished = list.value.filter((e) => e.status === "completed");
    const genreCounts = new Map<string, number>();
    list.value.forEach((entry) =>
      entry.genres.forEach((genre) =>
        genreCounts.set(genre.name, (genreCounts.get(genre.name) ?? 0) + 1),
      ),
    );
    const topGenre = [...genreCounts].sort((a, b) => b[1] - a[1])[0]?.[0];

    return {
      total,
      completed: finished.length,
      completionRate: total ? Math.round((finished.length / total) * 100) : 0,
      hours: finished.reduce((sum, entry) => sum + (entry.playtime ?? 0), 0),
      topGenre: topGenre ?? "—",
    };
  });

  const get = (id: number) => entries.value[id];

  const byStatus = (status: ShelfStatus) =>
    list.value.filter((entry) => entry.status === status);

  const upsert = (game: GameBasics, status?: ShelfStatus) => {
    const existing = entries.value[game.id];
    const now = new Date().toISOString();
    entries.value[game.id] = {
      id: game.id,
      slug: game.slug,
      name: game.name,
      background_image: game.background_image,
      metacritic: game.metacritic,
      released: game.released,
      genres: game.genres.map(({ id, name, slug }) => ({ id, name, slug })),
      playtime: game.playtime ?? existing?.playtime ?? 0,
      status: status ?? existing?.status ?? "wishlist",
      rating: existing?.rating ?? null,
      addedAt: existing?.addedAt ?? now,
      updatedAt: now,
    };
    return entries.value[game.id]!;
  };

  const setRating = (id: number, rating: number | null) => {
    const entry = entries.value[id];
    if (!entry) return;
    entry.rating = rating;
    entry.updatedAt = new Date().toISOString();
  };

  const remove = (id: number) => {
    delete entries.value[id];
  };

  const exportJson = () =>
    JSON.stringify({ version: 1, games: list.value }, null, 2);

  // Merges games from an exported file into the shelf. Returns how many were
  // imported, or throws when the file isn't a shelf export.
  const importJson = (text: string) => {
    const parsed = JSON.parse(text);
    const games: unknown[] = Array.isArray(parsed) ? parsed : parsed?.games;
    if (!Array.isArray(games)) throw new Error("Not a Game Shelf export");
    const valid = games.filter(isShelfEntry);
    valid.forEach((entry) => {
      entries.value[entry.id] = entry;
    });
    return valid.length;
  };

  return {
    entries,
    list,
    count,
    counts,
    stats,
    get,
    byStatus,
    upsert,
    setRating,
    remove,
    exportJson,
    importJson,
  };
});
