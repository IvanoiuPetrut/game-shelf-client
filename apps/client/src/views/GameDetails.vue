<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
  getAdditions,
  getGame,
  getGameSeries,
  getMovies,
  getScreenshots,
  getStoreLinks,
} from "@/services/rawg";
import type {
  GameDetails,
  GameSummary,
  Movie,
  RatingBucket,
  Screenshot,
  StoreLink,
} from "@/types/rawg";
import { useBackdropStore } from "@/stores/backdrop";
import { formatDate, resizedImage } from "@/utils/format";
import { sanitizeHtml } from "@/utils/sanitize";
import ScoreBadge from "@/components/ui/ScoreBadge.vue";
import ChipTag from "@/components/ui/ChipTag.vue";
import SkeletonBlock from "@/components/ui/SkeletonBlock.vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import ShelfControl from "@/components/ShelfControl.vue";
import LightboxGallery from "@/components/LightboxGallery.vue";
import GamesScroller from "@/components/GamesScroller.vue";

const props = defineProps<{
  id: string;
}>();

const backdrop = useBackdropStore();

const game = ref<GameDetails | null>(null);
const notFound = ref(false);
const screenshots = ref<Screenshot[]>([]);
const movies = ref<Movie[]>([]);
const storeLinks = ref<StoreLink[]>([]);
const series = ref<GameSummary[]>([]);
const additions = ref<GameSummary[]>([]);

const descriptionExpanded = ref(false);
const lightboxIndex = ref<number | null>(null);

const RATING_ORDER: RatingBucket["title"][] = [
  "exceptional",
  "recommended",
  "meh",
  "skip",
];

const ratings = computed(() =>
  [...(game.value?.ratings ?? [])].sort(
    (a, b) => RATING_ORDER.indexOf(a.title) - RATING_ORDER.indexOf(b.title),
  ),
);

const stores = computed(() =>
  (game.value?.stores ?? []).map(({ store }) => ({
    id: store.id,
    name: store.name,
    url:
      storeLinks.value.find((link) => link.store_id === store.id)?.url ??
      (store.domain ? `https://${store.domain}` : undefined),
  })),
);

const description = computed(() => sanitizeHtml(game.value?.description));

const isLongDescription = computed(
  () => (game.value?.description.length ?? 0) > 700,
);

const screenshotUrls = computed(() => screenshots.value.map((s) => s.image));

const loadGame = async () => {
  try {
    game.value = await getGame(props.id);
  } catch {
    notFound.value = true;
    document.title = "Game not found · Game Shelf";
    return;
  }

  document.title = `${game.value.name} · Game Shelf`;
  backdrop.set(game.value.background_image);

  // Extras are nice to have, so a failure in one never breaks the page
  const [shots, trailers, links] = await Promise.allSettled([
    getScreenshots(props.id),
    getMovies(props.id),
    getStoreLinks(props.id),
  ]);
  if (shots.status === "fulfilled") screenshots.value = shots.value.results;
  if (trailers.status === "fulfilled") movies.value = trailers.value.results;
  if (links.status === "fulfilled") storeLinks.value = links.value.results;

  const [seriesResult, additionsResult] = await Promise.allSettled([
    getGameSeries(props.id),
    getAdditions(props.id),
  ]);
  if (seriesResult.status === "fulfilled")
    series.value = seriesResult.value.results;
  if (additionsResult.status === "fulfilled")
    additions.value = additionsResult.value.results;
};

onMounted(loadGame);
</script>

<template>
  <main class="details">
    <template v-if="game">
      <section class="hero">
        <div class="hero__art" aria-hidden="true">
          <img :src="resizedImage(game.background_image, 1280)" alt="" />
        </div>
        <div class="hero__inner container">
          <div v-tilt="6" class="hero__cover">
            <img
              v-if="game.background_image"
              :src="resizedImage(game.background_image, 640)"
              :alt="game.name"
            />
          </div>
          <div class="hero__info">
            <p class="eyebrow">
              <AppIcon name="calendar" :size="16" />
              {{ game.tba ? "TBA" : formatDate(game.released) }}
              <template v-if="game.playtime">
                · <AppIcon name="clock" :size="16" /> ~{{ game.playtime }}h
              </template>
            </p>
            <h1 class="hero__title">{{ game.name }}</h1>
            <div class="hero__scores">
              <div v-if="game.metacritic" class="score-block">
                <ScoreBadge :score="game.metacritic" size="lg" />
                <span>Metascore</span>
              </div>
              <div v-if="game.rating" class="score-block">
                <span class="score-block__value"
                  >★ {{ game.rating.toFixed(1) }}</span
                >
                <span
                  >{{ game.ratings_count.toLocaleString() }} player
                  ratings</span
                >
              </div>
              <ChipTag v-if="game.esrb_rating"
                >ESRB {{ game.esrb_rating.name }}</ChipTag
              >
            </div>
            <div class="hero__chips">
              <ChipTag
                v-for="genre in game.genres"
                :key="genre.id"
                :to="{ name: 'category', params: { category: genre.slug } }"
              >
                {{ genre.name }}
              </ChipTag>
            </div>
            <ShelfControl :game="game" />
          </div>
        </div>
      </section>

      <div class="body container">
        <div class="body__main">
          <section v-reveal class="section">
            <h2 class="section__title">About</h2>
            <div
              class="description"
              :class="{
                'description--clamped':
                  isLongDescription && !descriptionExpanded,
              }"
              v-html="description"
            ></div>
            <button
              v-if="isLongDescription"
              class="description__toggle"
              @click="descriptionExpanded = !descriptionExpanded"
            >
              {{ descriptionExpanded ? "Show less" : "Read more" }}
            </button>
          </section>

          <section v-if="screenshots.length > 0" v-reveal class="section">
            <h2 class="section__title">Screenshots</h2>
            <div class="shots">
              <button
                v-for="(shot, index) in screenshots"
                :key="shot.id"
                class="shot"
                :aria-label="`Open screenshot ${index + 1}`"
                @click="lightboxIndex = index"
              >
                <img
                  :src="resizedImage(shot.image, 640)"
                  alt=""
                  loading="lazy"
                />
              </button>
            </div>
          </section>

          <section v-if="movies.length > 0" v-reveal class="section">
            <h2 class="section__title">Trailers</h2>
            <div class="trailers">
              <video
                v-for="movie in movies"
                :key="movie.id"
                :src="movie.data.max"
                :poster="movie.preview"
                controls
                preload="none"
                class="trailer"
              ></video>
            </div>
          </section>
        </div>

        <aside class="body__aside">
          <div v-if="ratings.length > 0" class="panel">
            <h3 class="panel__title">Player ratings</h3>
            <div class="ratings-bar">
              <span
                v-for="bucket in ratings"
                :key="bucket.id"
                class="ratings-bar__part"
                :class="`rating--${bucket.title}`"
                :style="{ flexGrow: bucket.percent }"
                :title="`${bucket.title}: ${bucket.percent}%`"
              ></span>
            </div>
            <ul class="ratings-legend">
              <li v-for="bucket in ratings" :key="bucket.id">
                <span class="dot" :class="`rating--${bucket.title}`"></span>
                <span class="ratings-legend__name">{{ bucket.title }}</span>
                <span class="ratings-legend__value"
                  >{{ Math.round(bucket.percent) }}%</span
                >
              </li>
            </ul>
          </div>

          <div class="panel">
            <h3 class="panel__title">Details</h3>
            <dl class="facts">
              <template v-if="game.developers.length > 0">
                <dt>Developer</dt>
                <dd>
                  <RouterLink
                    v-for="developer in game.developers"
                    :key="developer.id"
                    :to="{
                      name: 'developer',
                      params: { developer: developer.id },
                    }"
                  >
                    {{ developer.name }}
                  </RouterLink>
                </dd>
              </template>
              <template v-if="game.publishers.length > 0">
                <dt>Publisher</dt>
                <dd>
                  <RouterLink
                    v-for="publisher in game.publishers"
                    :key="publisher.id"
                    :to="{
                      name: 'publisher',
                      params: { publisher: publisher.id },
                    }"
                  >
                    {{ publisher.name }}
                  </RouterLink>
                </dd>
              </template>
              <dt>Released</dt>
              <dd>{{ game.tba ? "TBA" : formatDate(game.released) }}</dd>
              <template v-if="game.website">
                <dt>Website</dt>
                <dd>
                  <a :href="game.website" target="_blank" rel="noopener">
                    Official site <AppIcon name="external" :size="14" />
                  </a>
                </dd>
              </template>
            </dl>
            <template v-if="game.platforms?.length">
              <h4 class="panel__subtitle">Platforms</h4>
              <div class="chips">
                <ChipTag
                  v-for="{ platform } in game.platforms"
                  :key="platform.id"
                >
                  {{ platform.name }}
                </ChipTag>
              </div>
            </template>
          </div>

          <div v-if="stores.length > 0" class="panel">
            <h3 class="panel__title">Where to buy</h3>
            <div class="stores">
              <a
                v-for="store in stores"
                :key="store.id"
                :href="store.url"
                target="_blank"
                rel="noopener"
                class="store"
              >
                {{ store.name }} <AppIcon name="external" :size="16" />
              </a>
            </div>
          </div>

          <div v-if="game.tags.length > 0" class="panel">
            <h3 class="panel__title">Tags</h3>
            <div class="chips">
              <ChipTag v-for="tag in game.tags.slice(0, 14)" :key="tag.id">
                {{ tag.name }}
              </ChipTag>
            </div>
          </div>
        </aside>
      </div>

      <GamesScroller
        v-if="series.length > 0"
        title="From the same series"
        :games="series"
      />
      <GamesScroller
        v-if="additions.length > 0"
        title="DLC & editions"
        :games="additions"
      />

      <LightboxGallery v-model:index="lightboxIndex" :images="screenshotUrls" />
    </template>

    <div v-else-if="notFound" class="missing container">
      <h1>We couldn't find that game</h1>
      <p>It may have been removed from the RAWG database.</p>
      <RouterLink
        :to="{ name: 'category', params: { category: 'all' } }"
        class="btn btn--lg"
      >
        Browse games
      </RouterLink>
    </div>

    <div v-else class="container loading">
      <SkeletonBlock height="clamp(320px, 40vw, 440px)" radius="var(--r-lg)" />
      <SkeletonBlock width="50%" height="2.4rem" style="margin-top: 2rem" />
      <SkeletonBlock height="8rem" style="margin-top: 1.2rem" />
    </div>
  </main>
</template>

<style lang="scss" scoped>
@use "@/assets/style/mixins.scss" as mixins;

// * Hero

.hero {
  padding-block: 3.2rem 4.8rem;
  margin-bottom: 1.6rem;
}

.hero__art {
  position: absolute;
  inset: -6rem 0 0;
  overflow: hidden;
  mask-image: linear-gradient(180deg, black 30%, transparent);
  -webkit-mask-image: linear-gradient(180deg, black 30%, transparent);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.35;
    filter: saturate(120%);
  }
}

.hero__inner {
  display: grid;
  gap: 3.2rem;
  align-items: end;

  @media (min-width: 950px) {
    grid-template-columns: minmax(280px, 0.9fr) 1.4fr;
  }
}

.hero__cover {
  aspect-ratio: 16 / 10;
  border-radius: var(--r-lg);
  overflow: hidden;
  box-shadow:
    var(--shadow-2),
    0 0 0 1px rgb(255 255 255 / 0.12),
    0 30px 80px rgb(139 92 246 / 0.25);
  background: var(--neutral-bg-secondary);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

.hero__info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.2rem;
}

.hero__title {
  font-size: clamp(2.2rem, 1.2rem + 4vw, 4.4rem);
  font-weight: 700;
  line-height: 1.02;
  letter-spacing: -0.035em;
}

.hero__scores {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.6rem;
}

.score-block {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  color: var(--neutral-text-secondary);
  font-size: 0.9rem;
}

.score-block__value {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--warning);
}

.hero__chips,
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

// * Body

.body {
  display: grid;
  gap: 3.2rem;
  margin-bottom: 6.4rem;

  @media (min-width: 1000px) {
    grid-template-columns: 1fr 360px;
    align-items: start;
  }
}

.body__main {
  min-width: 0;
}

.section {
  margin-bottom: 4.8rem;
}

.section__title {
  @include mixins.section-title;
  margin-bottom: 1.2rem;
}

.description {
  color: var(--neutral-text-secondary);
  font-size: 1.05rem;
  line-height: 1.75;

  :deep(p) {
    margin-bottom: 1rem;
  }

  :deep(h3) {
    color: var(--neutral-text);
    margin: 1.6rem 0 0.6rem;
  }

  &--clamped {
    max-height: 16rem;
    overflow: hidden;
    mask-image: linear-gradient(180deg, black 55%, transparent);
    -webkit-mask-image: linear-gradient(180deg, black 55%, transparent);
  }
}

.description__toggle {
  margin-top: 0.6rem;
  padding: 0;
  border: none;
  background: none;
  color: var(--accent-strong);
  font-weight: 700;
  cursor: pointer;
}

.shots {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}

.shot {
  padding: 0;
  border: 1px solid var(--border-glass);
  border-radius: var(--r-md);
  overflow: hidden;
  background: var(--neutral-bg-secondary);
  cursor: zoom-in;
  aspect-ratio: 16 / 9;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s var(--ease-out);
  }

  &:hover img {
    transform: scale(1.06);
  }
}

.trailers {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1rem;
}

.trailer {
  width: 100%;
  border-radius: var(--r-md);
  background: black;
}

// * Aside

.body__aside {
  display: grid;
  gap: 1.6rem;

  @media (min-width: 1000px) {
    position: sticky;
    top: 6.4rem;
  }
}

.panel {
  @include mixins.glass-panel;
  padding: 1.6rem;
}

.panel__title {
  font-size: 1.1rem;
  margin-bottom: 1.2rem;
}

.panel__subtitle {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--neutral-text-secondary);
  margin: 1.2rem 0 0.6rem;
}

.ratings-bar {
  display: flex;
  gap: 3px;
  height: 0.8rem;
  border-radius: 999px;
  overflow: hidden;
  animation: grow 1s var(--ease-out);
  transform-origin: left;
}

.ratings-bar__part {
  flex-basis: 0;
  min-width: 4px;
}

.rating--exceptional {
  background: var(--success);
}

.rating--recommended {
  background: var(--accent);
}

.rating--meh {
  background: var(--warning);
}

.rating--skip {
  background: var(--error);
}

.ratings-legend {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.4rem 1rem;
  margin-top: 1rem;
  font-size: 0.9rem;

  li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
}

.ratings-legend__name {
  text-transform: capitalize;
  color: var(--neutral-text-secondary);
}

.ratings-legend__value {
  margin-left: auto;
  font-weight: 700;
}

.dot {
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
}

.facts {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.6rem 1.2rem;

  dt {
    color: var(--neutral-text-secondary);
  }

  dd {
    margin: 0;
    font-weight: 600;
    display: flex;
    flex-wrap: wrap;
    gap: 0 0.6rem;
  }

  a {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
  }
}

.stores {
  display: grid;
  gap: 0.6rem;
}

.store {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.7rem 1rem;
  border-radius: var(--r-md);
  border: 1px solid var(--border-glass);
  background: rgb(255 255 255 / 0.04);
  color: var(--neutral-text);
  font-weight: 600;
  transition:
    background-color 0.2s,
    border-color 0.2s;

  &:hover {
    color: var(--neutral-text);
    border-color: var(--accent);
    background: var(--accent-transparent);
  }
}

// * Fallback states

.missing {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  padding-block: 8rem;
  text-align: center;

  p {
    color: var(--neutral-text-secondary);
  }
}

.loading {
  padding-top: 3.2rem;
}

@keyframes grow {
  from {
    transform: scaleX(0);
  }
}
</style>
