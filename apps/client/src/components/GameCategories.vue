<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { listGenres } from "@/services/rawg";
import type { Genre } from "@/types/rawg";
import { resizedImage } from "@/utils/format";

// RAWG genre slugs, with local art for the original four so tiles never
// render empty while the genre list loads
const FEATURED_GENRES = [
  { slug: "action", name: "Action", image: "/assets/images/action.webp" },
  { slug: "role-playing-games-rpg", name: "RPG" },
  { slug: "indie", name: "Indie", image: "/assets/images/indie.webp" },
  { slug: "strategy", name: "Strategy", image: "/assets/images/strategy.webp" },
  { slug: "shooter", name: "Shooter" },
  { slug: "casual", name: "Casual", image: "/assets/images/casual.webp" },
];

const genres = ref<Genre[]>([]);

const tiles = computed(() =>
  FEATURED_GENRES.map((featured) => {
    const genre = genres.value.find((g) => g.slug === featured.slug);
    return {
      ...featured,
      image: featured.image ?? resizedImage(genre?.image_background, 640),
      count: genre?.games_count,
    };
  }),
);

const formatCount = (count: number) =>
  new Intl.NumberFormat("en", { notation: "compact" }).format(count);

onMounted(async () => {
  try {
    genres.value = (await listGenres()).results;
  } catch {
    // The tiles still work without counts and remote art
  }
});
</script>

<template>
  <section v-reveal class="categories container">
    <h2 class="categories__title">Browse by genre</h2>
    <div class="categories__grid">
      <RouterLink
        v-for="tile in tiles"
        :key="tile.slug"
        :to="{ name: 'category', params: { category: tile.slug } }"
        class="tile"
      >
        <img
          v-if="tile.image"
          :src="tile.image"
          alt=""
          class="tile__img"
          loading="lazy"
        />
        <div class="tile__shade"></div>
        <div class="tile__text">
          <p class="tile__name">{{ tile.name }}</p>
          <p v-if="tile.count" class="tile__count">
            {{ formatCount(tile.count) }} games
          </p>
        </div>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@/assets/style/mixins.scss" as mixins;

.categories__title {
  @include mixins.section-title;
  margin-bottom: 1.6rem;
}

.categories__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.2rem;

  @media (min-width: 800px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.6rem;
  }
}

.tile {
  aspect-ratio: 16 / 10;
  border-radius: var(--r-lg);
  overflow: hidden;
  background: linear-gradient(
    135deg,
    var(--accent-transparent),
    var(--neutral-bg-secondary)
  );
  border: 1px solid var(--border-glass);
  transition:
    box-shadow 0.3s,
    border-color 0.3s,
    transform 0.3s var(--ease-out);

  &:hover {
    transform: translateY(-4px);
    border-color: var(--accent);
    box-shadow: var(--glow-accent);

    .tile__img {
      transform: scale(1.08);
    }

    .tile__shade {
      opacity: 0.7;
    }
  }
}

.tile__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s var(--ease-out);
}

.tile__shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, rgb(11 11 18 / 0.9), rgb(76 29 149 / 0.25));
  transition: opacity 0.3s;
}

.tile__text {
  position: absolute;
  left: 1.2rem;
  bottom: 1rem;
}

.tile__name {
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 1rem + 1vw, 1.8rem);
  font-weight: 700;
  color: var(--neutral-text);
}

.tile__count {
  font-size: 0.9rem;
  color: var(--neutral-text-secondary);
}
</style>
