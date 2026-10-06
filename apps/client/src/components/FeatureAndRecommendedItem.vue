<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useGamesRandomStore } from "@/stores/games-random";
import { useBackdropStore } from "@/stores/backdrop";
import { resizedImage } from "@/utils/format";
import BaseCarousel from "./BaseCarousel.vue";
import ShelfBookmark from "./ShelfBookmark.vue";
import ScoreBadge from "./ui/ScoreBadge.vue";
import ChipTag from "./ui/ChipTag.vue";
import SkeletonBlock from "./ui/SkeletonBlock.vue";
import AppIcon from "./ui/AppIcon.vue";

const store = useGamesRandomStore();
const backdrop = useBackdropStore();

const current = ref(0);
const games = computed(() => store.games);
const game = computed(() => games.value[current.value]);

watch(game, (value) => backdrop.set(value?.background_image), {
  immediate: true,
});
</script>

<template>
  <div class="featured">
    <BaseCarousel
      v-if="games.length > 0"
      v-model:current="current"
      :count="games.length"
      label="Featured games"
    >
      <div class="stage">
        <Transition name="slide">
          <article v-if="game" :key="game.id" class="slide">
            <img
              :src="resizedImage(game.background_image, 1280)"
              :alt="game.name"
              class="slide__art"
            />
            <div class="slide__shade"></div>
            <div class="slide__content">
              <span class="eyebrow">
                <AppIcon name="sparkles" :size="16" /> Featured pick
              </span>
              <h2 class="slide__title">{{ game.name }}</h2>
              <div class="slide__meta">
                <ScoreBadge :score="game.metacritic" />
                <span v-if="game.released">{{
                  game.released.slice(0, 4)
                }}</span>
                <span v-if="game.playtime">~{{ game.playtime }}h to beat</span>
                <span v-if="game.rating">★ {{ game.rating.toFixed(1) }}</span>
              </div>
              <div class="slide__chips">
                <ChipTag
                  v-for="genre in game.genres.slice(0, 3)"
                  :key="genre.id"
                >
                  {{ genre.name }}
                </ChipTag>
              </div>
              <div class="slide__shots">
                <img
                  v-for="shot in game.short_screenshots?.slice(1, 4)"
                  :key="shot.id"
                  :src="resizedImage(shot.image, 420)"
                  alt=""
                  loading="lazy"
                />
              </div>
              <div class="slide__actions">
                <RouterLink
                  :to="{ name: 'gameDetails', params: { id: game.id } }"
                  class="btn btn--lg"
                >
                  View game <AppIcon name="arrow-right" :size="18" />
                </RouterLink>
                <ShelfBookmark :game="game" />
              </div>
            </div>
          </article>
        </Transition>
      </div>
    </BaseCarousel>
    <SkeletonBlock
      v-else
      height="clamp(460px, 56vw, 620px)"
      radius="var(--r-lg)"
    />
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/style/component.scss" as component;

.featured {
  @include component.container;
  margin-bottom: clamp(4rem, 8vw, 8rem);
}

.stage {
  height: clamp(460px, 56vw, 620px);
  background: var(--neutral-bg-secondary);
}

.slide {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
}

.slide__art {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: ken-burns 14s ease-out forwards;
}

.slide__shade {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      0deg,
      rgb(11 11 18 / 0.95) 0%,
      rgb(11 11 18 / 0.4) 50%,
      transparent 80%
    ),
    linear-gradient(90deg, rgb(11 11 18 / 0.75) 0%, transparent 60%);
}

.slide__content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  padding: clamp(1.6rem, 4vw, 4rem);
  max-width: 760px;

  > * {
    animation: rise 0.7s var(--ease-out) backwards;
  }

  @for $i from 2 through 7 {
    > :nth-child(#{$i}) {
      animation-delay: #{$i * 0.06}s;
    }
  }
}

.slide__title {
  font-size: clamp(2rem, 1.2rem + 3.6vw, 4rem);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.03em;
  text-shadow: 0 4px 30px rgb(0 0 0 / 0.5);
}

.slide__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.2rem;
  color: var(--neutral-text-secondary);
  font-weight: 600;
}

.slide__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.slide__shots {
  display: none;
  gap: 0.8rem;

  @media (min-width: 900px) {
    display: flex;
  }

  img {
    width: 150px;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    border-radius: var(--r-sm);
    border: 1px solid var(--border-glass);
  }
}

.slide__actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.4rem;
}

.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.7s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}

@keyframes ken-burns {
  from {
    transform: scale(1.12);
  }
  to {
    transform: scale(1);
  }
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
}
</style>
