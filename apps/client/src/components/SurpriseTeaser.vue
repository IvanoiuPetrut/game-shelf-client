<script setup lang="ts">
import { computed } from "vue";
import { useGamesTopCriticsStore } from "@/stores/games-top-critics";
import { resizedImage } from "@/utils/format";
import AppIcon from "./ui/AppIcon.vue";

const critics = useGamesTopCriticsStore();

const covers = computed(() =>
  critics.games
    .filter((game) => game.background_image)
    .slice(0, 5)
    .map((game) => resizedImage(game.background_image, 420)),
);

// Position of each card relative to the middle of the fanned deck
const offset = (index: number) => {
  const i = index - (covers.value.length - 1) / 2;
  return { "--i": i, "--a": Math.abs(i) };
};
</script>

<template>
  <section v-reveal class="teaser container">
    <div class="teaser__panel">
      <div class="teaser__copy">
        <span class="eyebrow"
          ><AppIcon name="dice" :size="16" /> Can't decide?</span
        >
        <h2 class="teaser__title">Let fate pick your next game</h2>
        <p class="teaser__text">
          Roll the dice and we'll pull a random, well-reviewed game from the
          whole catalogue. Filter by genre if you're feeling picky.
        </p>
        <RouterLink :to="{ name: 'surprise' }" class="btn btn--lg">
          <AppIcon name="dice" :size="18" class="teaser__dice" /> Roll the dice
        </RouterLink>
      </div>
      <div class="deck" aria-hidden="true">
        <img
          v-for="(cover, index) in covers"
          :key="cover"
          :src="cover"
          alt=""
          class="deck__card"
          :style="offset(index)"
          loading="lazy"
        />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use "@/assets/style/mixins.scss" as mixins;

.teaser {
  margin-bottom: clamp(4rem, 8vw, 8rem);
}

.teaser__panel {
  @include mixins.glass-panel;
  display: grid;
  gap: 3.2rem;
  align-items: center;
  padding: clamp(2rem, 5vw, 4.8rem);
  overflow: hidden;
  background:
    radial-gradient(circle at 85% 50%, rgb(139 92 246 / 0.35), transparent 55%),
    var(--surface-glass);

  @media (min-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }

  &:hover .deck__card {
    transform: translateX(calc(var(--i) * 42%)) rotate(calc(var(--i) * 9deg))
      translateY(calc(var(--a) * 10px));
  }

  &:hover .teaser__dice {
    transform: rotate(180deg);
  }
}

.teaser__copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.2rem;
}

.teaser__title {
  @include mixins.section-title;
}

.teaser__text {
  max-width: 46ch;
  color: var(--neutral-text-secondary);
}

.teaser__dice {
  transition: transform 0.6s var(--ease-out);
}

.deck {
  height: 240px;
  display: grid;
  place-items: center;
}

.deck__card {
  grid-area: 1 / 1;
  width: min(48%, 220px);
  aspect-ratio: 3 / 4;
  object-fit: cover;
  border-radius: var(--r-md);
  box-shadow:
    var(--shadow-2),
    0 0 0 1px rgb(255 255 255 / 0.1);
  transform: translateX(calc(var(--i) * 26%)) rotate(calc(var(--i) * 6deg))
    translateY(calc(var(--a) * 6px));
  transition: transform 0.6s var(--ease-out);
}
</style>
