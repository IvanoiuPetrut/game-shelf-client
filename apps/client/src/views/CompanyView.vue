<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { getDeveloper, getPublisher } from "@/services/rawg";
import { usePagedGames } from "@/composables/usePagedGames";
import { useBackdropStore } from "@/stores/backdrop";
import type { Company } from "@/types/rawg";
import GameCard from "@/components/GameCard.vue";
import SkeletonBlock from "@/components/ui/SkeletonBlock.vue";
import InfiniteSentinel from "@/components/ui/InfiniteSentinel.vue";

// Lists the games made by a developer, or released by a publisher
const props = defineProps<{
  kind: "developer" | "publisher";
  id: string;
}>();

const backdrop = useBackdropStore();
const company = ref<Company | null>(null);

const { games, total, loading, error, hasMore, loadMore, reset } =
  usePagedGames(() => ({
    ordering: "-metacritic",
    [props.kind === "developer" ? "developers" : "publishers"]: props.id,
  }));

const heading = computed(() =>
  props.kind === "developer" ? "Games made by" : "Games published by",
);

onMounted(async () => {
  reset();
  try {
    company.value = await (props.kind === "developer"
      ? getDeveloper(props.id)
      : getPublisher(props.id));
    document.title = `${company.value.name} · Game Shelf`;
    backdrop.set(company.value.image_background);
  } catch {
    // The game list below still renders without the company details
  }
});
</script>

<template>
  <main class="company page container">
    <header class="company__header">
      <p class="eyebrow">{{ heading }}</p>
      <h1 class="company__name">
        <template v-if="company">{{ company.name }}</template>
        <SkeletonBlock v-else width="min(60%, 420px)" height="3.2rem" />
      </h1>
      <p v-if="total !== null" class="company__count">
        {{ total.toLocaleString() }} games
      </p>
    </header>

    <div class="grid">
      <GameCard v-for="game in games" :key="game.id" :game="game" />
      <template v-if="loading">
        <SkeletonBlock
          v-for="n in 4"
          :key="`skeleton-${n}`"
          height="auto"
          style="aspect-ratio: 16 / 10"
        />
      </template>
    </div>
    <p v-if="error" class="status">{{ error }}</p>
    <InfiniteSentinel
      :disabled="loading || !hasMore || !!error"
      @visible="loadMore"
    />
  </main>
</template>

<style lang="scss" scoped>
.company__header {
  margin-bottom: 3.2rem;
}

.company__name {
  font-size: clamp(2.4rem, 1.6rem + 3vw, 4rem);
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 1.1;
}

.company__count {
  margin-top: 0.4rem;
  color: var(--neutral-text-secondary);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 2.4rem 1.6rem;
}

.status {
  padding: 3.2rem 0;
  text-align: center;
  color: var(--error);
}
</style>
