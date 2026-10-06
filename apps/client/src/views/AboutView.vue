<script setup lang="ts">
import AppIcon, { type IconName } from "@/components/ui/AppIcon.vue";

const features: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "search",
    title: "Discover",
    text: "Search and filter hundreds of thousands of games by genre, platform, store and tag.",
  },
  {
    icon: "bookmark",
    title: "Track",
    text: "Keep a shelf of what you're playing, have finished, want to play or dropped, and rate each game.",
  },
  {
    icon: "calendar",
    title: "Plan ahead",
    text: "See what's releasing over the next six months, grouped by month.",
  },
  {
    icon: "dice",
    title: "Get surprised",
    text: "Can't choose? Roll the dice for a random, well-reviewed game.",
  },
];
</script>

<template>
  <main class="about page container">
    <header class="about__header">
      <span class="eyebrow"><AppIcon name="sparkles" :size="16" /> About</span>
      <h1 class="about__title">
        A home for <span class="text-gradient">every game you play</span>
      </h1>
      <p class="about__lead">
        Game Shelf helps you find your next game and remember the ones you've
        played. It's free and needs no account.
      </p>
    </header>

    <section class="features">
      <article
        v-for="feature in features"
        :key="feature.title"
        v-reveal
        class="feature"
      >
        <span class="feature__icon"><AppIcon :name="feature.icon" /></span>
        <h2 class="feature__title">{{ feature.title }}</h2>
        <p>{{ feature.text }}</p>
      </article>
    </section>

    <section v-reveal class="notes">
      <div class="note">
        <h2>Your data stays with you</h2>
        <p>
          Your shelf is saved in your browser's local storage, never on a
          server. Use <strong>Export</strong> on the
          <RouterLink :to="{ name: 'shelf' }">My Shelf</RouterLink> page to back
          it up or move it to another device, and <strong>Import</strong> to
          bring it back.
        </p>
      </div>
      <div class="note">
        <h2>Where the data comes from</h2>
        <p>
          All game information, images and ratings come from the
          <a href="https://rawg.io/" target="_blank" rel="noopener"
            >RAWG Video Games Database</a
          >, the largest open video game database.
        </p>
      </div>
      <div class="note">
        <h2>How it's built</h2>
        <p>
          Vue 3 with the Composition API, Pinia, Vue Router and VueUse on the
          front end, and a small Express server that proxies and caches the RAWG
          API. The source is on
          <a
            href="https://github.com/IvanoiuPetrut"
            target="_blank"
            rel="noopener"
            >GitHub</a
          >.
        </p>
      </div>
    </section>
  </main>
</template>

<style lang="scss" scoped>
@use "@/assets/style/mixins.scss" as mixins;

.about__header {
  max-width: 760px;
  margin-bottom: 4.8rem;
}

.about__title {
  margin-top: 0.8rem;
  font-size: clamp(2.4rem, 1.4rem + 3.6vw, 4.4rem);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.035em;
}

.about__lead {
  margin-top: 1.2rem;
  font-size: 1.2rem;
  color: var(--neutral-text-secondary);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 1.6rem;
  margin-bottom: 4.8rem;
}

.feature {
  @include mixins.glass-panel;
  padding: 1.8rem;

  p {
    color: var(--neutral-text-secondary);
  }
}

.feature__icon {
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  margin-bottom: 1.2rem;
  border-radius: var(--r-md);
  background: var(--accent-transparent);
  color: var(--accent-strong);
}

.feature__title {
  font-size: 1.3rem;
  margin-bottom: 0.4rem;
}

.notes {
  display: grid;
  gap: 2.4rem;

  @media (min-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.note {
  h2 {
    font-size: 1.3rem;
    margin-bottom: 0.6rem;
  }

  p {
    color: var(--neutral-text-secondary);
  }

  strong {
    color: var(--neutral-text);
    font-weight: 600;
  }
}
</style>
