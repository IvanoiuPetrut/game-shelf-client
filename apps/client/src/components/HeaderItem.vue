<script setup lang="ts">
import { useShelfStore } from "@/stores/shelf";
import AppIcon from "./ui/AppIcon.vue";

const shelf = useShelfStore();

const shelfCovers = [
  "/assets/images/book_shelf_1.webp",
  "/assets/images/book_shelf_2.webp",
  "/assets/images/book_shelf_5.webp",
  "/assets/images/book_shelf_4.webp",
];
</script>

<template>
  <section class="hero">
    <div class="hero__copy">
      <span class="eyebrow">
        <AppIcon name="sparkles" :size="16" /> Track · Discover · Play
      </span>
      <h1 class="hero__title">
        Your games,<br />
        <span class="text-gradient">one shelf.</span>
      </h1>
      <p class="hero__description">
        Browse hundreds of thousands of games, see what's releasing next and
        keep a shelf of everything you're <strong>playing</strong>, have
        <strong>finished</strong> or want to play <strong>next</strong>.
      </p>
      <div class="hero__actions">
        <RouterLink :to="{ name: 'shelf' }" class="btn btn--lg">
          <AppIcon name="bookmark" :size="18" />
          <template v-if="shelf.count > 0">
            Open your shelf ({{ shelf.count }})
          </template>
          <template v-else>Start your shelf</template>
        </RouterLink>
        <RouterLink :to="{ name: 'surprise' }" class="btn btn--lg btn--ghost">
          <AppIcon name="dice" :size="18" /> Surprise me
        </RouterLink>
      </div>
    </div>

    <div class="visual" aria-hidden="true">
      <div class="visual__glow"></div>
      <div class="visual__panel">
        <div class="shelf__row">
          <img
            v-for="(cover, index) in shelfCovers"
            :key="cover"
            :src="cover"
            alt=""
            class="shelf__box"
            :style="{ animationDelay: `${index * -1.3}s` }"
          />
        </div>
        <div class="shelf__plank"></div>
      </div>
      <div v-tilt="10" class="visual__feature">
        <img src="/assets/images/book_shelf_3.webp" alt="" />
        <div class="feature__status">
          <span class="feature__dot"></span> Now playing
          <div class="feature__progress"><span></span></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use "@/assets/style/component.scss" as component;
@use "@/assets/style/mixins.scss" as mixins;

.hero {
  @include component.container;
  display: grid;
  align-items: center;
  gap: 4.8rem;
  padding-block: 3.2rem 6.4rem;

  @media (min-width: 1100px) {
    grid-template-columns: 1.1fr 1fr;
    padding-block: 4.8rem 8rem;
  }
}

.hero__copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.6rem;
}

.hero__title {
  font-size: clamp(2.6rem, 1.4rem + 5vw, 5.2rem);
  font-weight: 700;
  line-height: 1.02;
  letter-spacing: -0.04em;
}

.hero__description {
  max-width: 52ch;
  font-size: clamp(1.05rem, 1rem + 0.3vw, 1.25rem);
  color: var(--neutral-text-secondary);

  strong {
    color: var(--neutral-text);
    font-weight: 600;
  }
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.8rem;
}

// * Shelf illustration

.visual {
  height: clamp(300px, 70vw, 440px);
  width: min(100%, 560px);
  justify-self: center;
}

.visual__glow {
  position: absolute;
  inset: 10% 5% 0 15%;
  background: radial-gradient(
    circle,
    rgb(139 92 246 / 0.5),
    rgb(34 211 238 / 0.15) 45%,
    transparent 70%
  );
  filter: blur(40px);
}

.visual__panel {
  @include mixins.glass-panel;
  position: absolute;
  inset: 0 0 22% 12%;
  box-shadow: var(--shadow-2);
}

.shelf__row {
  position: absolute;
  left: 8%;
  right: 6%;
  bottom: 34%;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  gap: 4%;
}

.shelf__box {
  width: 20%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  border-radius: var(--r-sm);
  box-shadow:
    0 12px 24px rgb(0 0 0 / 0.45),
    inset 0 0 0 1px rgb(255 255 255 / 0.1);
  animation: bob 5.2s ease-in-out infinite;

  &:nth-child(2) {
    height: auto;
    width: 18%;
  }
}

.shelf__plank {
  position: absolute;
  left: 4%;
  right: 4%;
  bottom: calc(34% - 14px);
  height: 10px;
  border-radius: 999px;
  background: var(--brand-gradient);
  box-shadow:
    0 0 24px rgb(139 92 246 / 0.6),
    0 10px 30px rgb(34 211 238 / 0.2);
}

.visual__feature {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 56%;
  aspect-ratio: 16 / 10;
  border-radius: var(--r-lg);
  overflow: hidden;
  box-shadow:
    var(--shadow-2),
    0 0 0 1px rgb(255 255 255 / 0.12);
  z-index: 2;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

.feature__status {
  position: absolute;
  left: 0.8rem;
  right: 0.8rem;
  bottom: 0.8rem;
  padding: 0.5rem 0.8rem;
  border-radius: var(--r-md);
  background: rgb(11 11 18 / 0.7);
  backdrop-filter: blur(10px);
  font-size: 0.85rem;
  font-weight: 700;
}

.feature__dot {
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  margin-right: 0.3rem;
  border-radius: 50%;
  background: var(--cyan);
  box-shadow: 0 0 10px var(--cyan);
  animation: pulse 1.6s ease-in-out infinite;
}

.feature__progress {
  height: 4px;
  margin-top: 0.4rem;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.12);
  overflow: hidden;

  span {
    display: block;
    height: 100%;
    width: 62%;
    border-radius: inherit;
    background: var(--brand-gradient);
    animation: progress 2.4s var(--ease-out);
  }
}

@keyframes bob {
  50% {
    transform: translateY(-8px);
  }
}

@keyframes pulse {
  50% {
    opacity: 0.4;
  }
}

@keyframes progress {
  from {
    width: 0;
  }
}
</style>
