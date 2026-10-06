<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { usePreferredReducedMotion } from "@vueuse/core";
import { listGames } from "@/services/rawg";
import type { GameSummary } from "@/types/rawg";
import { useShelfStore } from "@/stores/shelf";
import { useToastStore } from "@/stores/toast";
import { useBackdropStore } from "@/stores/backdrop";
import { randomInt, resizedImage } from "@/utils/format";
import ScoreBadge from "@/components/ui/ScoreBadge.vue";
import ChipTag from "@/components/ui/ChipTag.vue";
import AppIcon from "@/components/ui/AppIcon.vue";

const GENRES = [
  { slug: null, name: "Any genre" },
  { slug: "action", name: "Action" },
  { slug: "role-playing-games-rpg", name: "RPG" },
  { slug: "adventure", name: "Adventure" },
  { slug: "indie", name: "Indie" },
  { slug: "strategy", name: "Strategy" },
  { slug: "shooter", name: "Shooter" },
  { slug: "puzzle", name: "Puzzle" },
];

const PAGE_SIZE = 40;
const MAX_PAGE = 25;
const SPIN_STEPS = 18;

const shelf = useShelfStore();
const toast = useToastStore();
const backdrop = useBackdropStore();
const reducedMotion = usePreferredReducedMotion();

const genre = ref<string | null>(null);
const pool = ref<GameSummary[]>([]);
const reel = ref<GameSummary[]>([]);
const reelIndex = ref(0);
const pick = ref<GameSummary | null>(null);
const spinning = ref(false);
const error = ref<string | null>(null);

// How many result pages each genre has, learned from the first request
const pageCounts = new Map<string, number>();
let cancelled = false;

const shown = computed(() => reel.value[reelIndex.value]);
const neighbour = (offset: number) => reel.value[reelIndex.value + offset];
const onShelf = computed(() =>
  pick.value ? shelf.get(pick.value.id) : undefined,
);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const shuffle = <T,>(items: T[]) => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
};

const fetchPool = async () => {
  const key = genre.value ?? "any";
  const params = {
    metacritic: "75,100",
    exclude_additions: true,
    page_size: PAGE_SIZE,
    genres: genre.value,
  };

  let pages = pageCounts.get(key);
  if (pages === undefined) {
    const first = await listGames({ ...params, page: 1 });
    pages = Math.max(1, Math.min(Math.ceil(first.count / PAGE_SIZE), MAX_PAGE));
    pageCounts.set(key, pages);
    if (pages === 1) return first.results;
  }
  return (await listGames({ ...params, page: randomInt(1, pages) })).results;
};

const roll = async () => {
  if (spinning.value) return;
  spinning.value = true;
  pick.value = null;
  error.value = null;

  try {
    if (pool.value.length < 6) {
      pool.value = shuffle(
        (await fetchPool()).filter((g) => g.background_image),
      );
    }
  } catch {
    error.value = "Couldn't reach the game database. Try again in a moment.";
    spinning.value = false;
    return;
  }

  const target = pool.value.pop();
  if (!target) {
    error.value = "No games found for this genre.";
    spinning.value = false;
    return;
  }

  // Build a reel of random covers that ends on the pick, then slow down
  // as it approaches the end like a slot machine
  const steps = reducedMotion.value === "reduce" ? 0 : SPIN_STEPS;
  const filler = Array.from(
    { length: steps + 1 },
    () => pool.value[randomInt(0, pool.value.length - 1)] ?? target,
  );
  reel.value = [...filler.slice(0, steps), target, filler[steps]!];
  reelIndex.value = 0;

  for (let i = 0; i < steps; i++) {
    await sleep(45 + Math.pow(i / steps, 2.4) * 320);
    if (cancelled) return;
    reelIndex.value = i + 1;
  }

  pick.value = target;
  backdrop.set(target.background_image);
  spinning.value = false;
};

const addToWishlist = () => {
  if (!pick.value) return;
  shelf.upsert(pick.value, "wishlist");
  toast.show(`Added ${pick.value.name} to your wishlist`, {
    label: "View shelf",
    to: { name: "shelf" },
  });
};

watch(genre, () => {
  pool.value = [];
  roll();
});

onMounted(roll);
onBeforeUnmount(() => (cancelled = true));
</script>

<template>
  <main class="surprise page container">
    <header class="surprise__header">
      <span class="eyebrow"
        ><AppIcon name="dice" :size="16" /> Random picker</span
      >
      <h1 class="surprise__title">What should I play?</h1>
      <p class="surprise__subtitle">
        We'll pick a random game with a Metascore of 75 or more. Narrow it down
        by genre, or just trust the dice.
      </p>
      <div class="genres" role="group" aria-label="Genre">
        <ChipTag
          v-for="item in GENRES"
          :key="item.name"
          as="button"
          :active="genre === item.slug"
          :disabled="spinning"
          @click="genre = item.slug"
        >
          {{ item.name }}
        </ChipTag>
      </div>
    </header>

    <section class="machine">
      <div
        class="reel"
        :class="{ 'reel--spinning': spinning, 'reel--done': pick }"
      >
        <div
          v-if="neighbour(-1)"
          class="reel__ghost reel__ghost--left"
          aria-hidden="true"
        >
          <img
            :src="resizedImage(neighbour(-1)!.background_image, 420)"
            alt=""
          />
        </div>
        <div class="reel__window">
          <img
            v-if="shown"
            :key="shown.id + '-' + reelIndex"
            :src="resizedImage(shown.background_image, 640)"
            :alt="pick ? pick.name : ''"
            class="reel__img"
          />
          <div v-else class="reel__placeholder">?</div>
          <div v-if="pick" class="reel__burst" aria-hidden="true"></div>
        </div>
        <div
          v-if="neighbour(1)"
          class="reel__ghost reel__ghost--right"
          aria-hidden="true"
        >
          <img
            :src="resizedImage(neighbour(1)!.background_image, 420)"
            alt=""
          />
        </div>
      </div>

      <div class="result" aria-live="polite">
        <p v-if="error" class="result__error">{{ error }}</p>
        <Transition name="result">
          <div v-if="pick" :key="pick.id" class="result__card">
            <p class="eyebrow">Your next game</p>
            <h2 class="result__name">{{ pick.name }}</h2>
            <div class="result__meta">
              <ScoreBadge :score="pick.metacritic" />
              <span v-if="pick.released">{{ pick.released.slice(0, 4) }}</span>
              <span v-if="pick.playtime">~{{ pick.playtime }}h</span>
              <span v-if="pick.rating">★ {{ pick.rating.toFixed(1) }}</span>
            </div>
            <div class="result__chips">
              <ChipTag v-for="g in pick.genres.slice(0, 3)" :key="g.id">{{
                g.name
              }}</ChipTag>
            </div>
            <div class="result__actions">
              <RouterLink
                :to="{ name: 'gameDetails', params: { id: pick.id } }"
                class="btn btn--lg"
              >
                View game <AppIcon name="arrow-right" :size="18" />
              </RouterLink>
              <button
                class="btn btn--lg btn--ghost"
                :disabled="!!onShelf"
                @click="addToWishlist"
              >
                <AppIcon name="bookmark" :size="18" :filled="!!onShelf" />
                {{ onShelf ? "On your shelf" : "Add to wishlist" }}
              </button>
            </div>
          </div>
        </Transition>
        <button class="roll btn btn--lg" :disabled="spinning" @click="roll">
          <AppIcon name="dice" :size="20" class="roll__dice" />
          {{ spinning ? "Rolling…" : pick ? "Roll again" : "Roll the dice" }}
        </button>
      </div>
    </section>
  </main>
</template>

<style lang="scss" scoped>
@use "@/assets/style/mixins.scss" as mixins;

.surprise__header {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 4rem;
}

.surprise__title {
  font-size: clamp(2.4rem, 1.6rem + 3vw, 4rem);
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 1.1;
}

.surprise__subtitle {
  max-width: 52ch;
  color: var(--neutral-text-secondary);
}

.genres {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.machine {
  display: grid;
  gap: 4rem;
  align-items: center;

  @media (min-width: 1000px) {
    grid-template-columns: 1.2fr 1fr;
  }
}

// * Reel

.reel {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 0;
}

.reel__window {
  width: min(100%, 520px);
  aspect-ratio: 16 / 10;
  border-radius: var(--r-lg);
  overflow: hidden;
  z-index: 2;
  background: var(--neutral-bg-secondary);
  box-shadow:
    var(--shadow-2),
    0 0 0 1px rgb(255 255 255 / 0.12);
  transition: box-shadow 0.5s;

  .reel--done & {
    box-shadow:
      var(--shadow-2),
      0 0 0 2px var(--accent),
      0 0 60px rgb(139 92 246 / 0.55);
    animation: land 0.5s var(--ease-out);
  }
}

.reel__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;

  .reel--spinning & {
    animation: flick 0.12s ease-out;
    filter: blur(1.5px) saturate(130%);
  }
}

.reel__placeholder {
  display: grid;
  place-items: center;
  height: 100%;
  font-family: var(--font-display);
  font-size: 6rem;
  color: var(--accent-strong);
}

.reel__ghost {
  position: absolute;
  width: min(36%, 220px);
  aspect-ratio: 16 / 10;
  border-radius: var(--r-md);
  overflow: hidden;
  opacity: 0.35;
  filter: blur(2px);
  transition: opacity 0.4s;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &--left {
    left: 0;
    transform: perspective(600px) rotateY(25deg);
  }

  &--right {
    right: 0;
    transform: perspective(600px) rotateY(-25deg);
  }

  .reel--done & {
    opacity: 0;
  }
}

.reel__burst {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, rgb(255 255 255 / 0.5), transparent 60%);
  animation: burst 0.7s ease-out forwards;
  pointer-events: none;
}

// * Result

.result {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2rem;
  min-height: 18rem;
}

.result__card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
}

.result__name {
  font-size: clamp(1.8rem, 1.2rem + 2vw, 3rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.03em;
}

.result__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  font-weight: 600;
  color: var(--neutral-text-secondary);
}

.result__chips,
.result__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.result__actions {
  gap: 1rem;
  margin-top: 0.6rem;
}

.result__error {
  color: var(--error);
}

.roll {
  background: var(--brand-gradient);
  box-shadow: var(--glow-accent);

  &:hover .roll__dice {
    transform: rotate(180deg);
  }
}

.roll__dice {
  transition: transform 0.5s var(--ease-out);

  .roll:disabled & {
    animation: spin 0.6s linear infinite;
  }
}

.result-enter-active {
  transition:
    opacity 0.5s,
    transform 0.5s var(--ease-out);
}

.result-enter-from {
  opacity: 0;
  transform: translateY(16px);
}

@keyframes flick {
  from {
    transform: translateY(-14%);
  }
}

@keyframes land {
  40% {
    transform: scale(1.04);
  }
}

@keyframes burst {
  from {
    opacity: 1;
    transform: scale(0.6);
  }
  to {
    opacity: 0;
    transform: scale(1.6);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
