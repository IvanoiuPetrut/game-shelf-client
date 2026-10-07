import { computed } from "vue";
import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import type { GameBasics, NamedRef } from "@/types/rawg";

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

const MAX_TEXT_LENGTH = 500;

const text = (value: unknown) =>
  typeof value === "string" && value.length <= MAX_TEXT_LENGTH
    ? value
    : undefined;

const numberIn = (value: unknown, min: number, max: number) =>
  typeof value === "number" && value >= min && value <= max
    ? value
    : undefined;

const isoDateText = (value: unknown) => {
  const date = text(value);
  return date && !Number.isNaN(Date.parse(date)) ? date : undefined;
};

const isNamedRef = (value: unknown): value is NamedRef => {
  const ref = value as NamedRef;
  return (
    Number.isSafeInteger(ref?.id) &&
    text(ref.name) !== undefined &&
    text(ref.slug) !== undefined
  );
};

// Rebuilds an entry from an imported file, keeping only known fields with the
// right types, so a crafted file can't put unexpected data in the shelf or
// break the pages that render it. Returns null when the entry is unusable.
const toShelfEntry = (value: unknown): ShelfEntry | null => {
  if (typeof value !== "object" || value === null) return null;
  const entry = value as Record<string, unknown>;
  const id = entry.id;
  const name = text(entry.name);
  const status = SHELF_STATUSES.find((s) => s.value === entry.status)?.value;
  if (!Number.isSafeInteger(id) || (id as number) <= 0 || !name || !status) {
    return null;
  }

  const image = text(entry.background_image);
  const now = new Date().toISOString();
  return {
    id: id as number,
    slug: text(entry.slug) ?? String(id),
    name,
    background_image: image?.startsWith("https://") ? image : null,
    metacritic: numberIn(entry.metacritic, 0, 100) ?? null,
    released: isoDateText(entry.released) ?? null,
    genres: Array.isArray(entry.genres)
      ? entry.genres
          .filter(isNamedRef)
          .map(({ id, name, slug }) => ({ id, name, slug }))
      : [],
    playtime: numberIn(entry.playtime, 0, 100_000) ?? 0,
    status,
    rating: numberIn(entry.rating, 1, 5) ?? null,
    addedAt: isoDateText(entry.addedAt) ?? now,
    updatedAt: isoDateText(entry.updatedAt) ?? now,
  };
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
    const valid = games
      .map(toShelfEntry)
      .filter((entry): entry is ShelfEntry => entry !== null);
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
