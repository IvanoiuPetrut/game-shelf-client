<script setup lang="ts">
import { computed } from "vue";
import type { GameBasics } from "@/types/rawg";
import { releaseCountdown, resizedImage } from "@/utils/format";
import ScoreBadge from "./ui/ScoreBadge.vue";
import ShelfBookmark from "./ShelfBookmark.vue";

const props = defineProps<{
  game: GameBasics;
  // Show how long until release instead of the genre and year
  countdown?: boolean;
}>();

const year = computed(() => props.game.released?.slice(0, 4));
const genre = computed(() => props.game.genres?.[0]?.name);
</script>

<template>
  <article class="card">
    <RouterLink
      :to="{ name: 'gameDetails', params: { id: game.id } }"
      class="card__link"
    >
      <div v-tilt class="card__media">
        <img
          v-if="game.background_image"
          :src="resizedImage(game.background_image)"
          :alt="game.name"
          class="card__img"
          loading="lazy"
          decoding="async"
        />
        <div v-else class="card__placeholder" aria-hidden="true">
          {{ game.name.charAt(0) }}
        </div>
        <ScoreBadge :score="game.metacritic" size="sm" class="card__score" />
        <span v-if="countdown" class="card__countdown">
          {{ releaseCountdown(game.released) }}
        </span>
        <slot name="overlay" />
      </div>
      <div class="card__body">
        <p class="card__eyebrow">
          <slot name="eyebrow">
            {{ genre }}<template v-if="genre && year"> · </template>{{ year }}
          </slot>
        </p>
        <h3 class="card__title">{{ game.name }}</h3>
      </div>
    </RouterLink>
    <ShelfBookmark :game="game" class="card__bookmark" />
  </article>
</template>

<style scoped lang="scss">
.card {
  min-width: 0;
}

.card__link {
  display: block;
  color: inherit;

  &:hover {
    color: inherit;

    .card__img {
      transform: scale(1.06);
    }

    .card__title {
      color: var(--accent-strong);
    }
  }
}

.card__media {
  aspect-ratio: 16 / 10;
  border-radius: var(--r-md);
  overflow: hidden;
  background: var(--neutral-bg-secondary);
  box-shadow: var(--shadow-1);
  border: 1px solid var(--border-glass);
}

.card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s var(--ease-out);
}

.card__placeholder {
  display: grid;
  place-items: center;
  height: 100%;
  font-family: var(--font-display);
  font-size: 3rem;
  color: var(--accent-strong);
  background: radial-gradient(
    circle at 30% 20%,
    var(--accent-transparent),
    transparent 70%
  );
}

.card__score {
  position: absolute;
  left: 0.7rem;
  bottom: 0.7rem;
}

.card__countdown {
  position: absolute;
  left: 0.7rem;
  top: 0.7rem;
  padding: 0.2rem 0.7rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  color: white;
  background: linear-gradient(120deg, var(--accent), #6d28d9);
  box-shadow: var(--glow-accent);
}

.card__body {
  padding: 0.8rem 0.2rem 0;
}

.card__eyebrow {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--neutral-text-secondary);
  min-height: 1.3em;
}

.card__title {
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.3;
  transition: color 0.2s;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card__bookmark {
  position: absolute;
  top: 0.7rem;
  right: 0.7rem;
  z-index: 2;
}
</style>
