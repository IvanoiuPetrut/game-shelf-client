<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useScrollLock, useWindowScroll } from "@vueuse/core";
import { useShelfStore } from "@/stores/shelf";
import NavSearch from "./NavSearch.vue";
import IconBook from "./icons/IconBook.vue";
import AppIcon from "./ui/AppIcon.vue";

const route = useRoute();
const shelf = useShelfStore();
const { y } = useWindowScroll();

const isMobileNavOpen = ref(false);
const isScrolled = computed(() => y.value > 24);
const bodyLocked = useScrollLock(
  typeof document !== "undefined" ? document.body : null,
);

const links = [
  { label: "Home", to: { name: "home" } },
  { label: "Browse", to: { name: "category", params: { category: "all" } } },
  { label: "Upcoming", to: { name: "upcoming" } },
  { label: "Surprise me", to: { name: "surprise" } },
];

watch(isMobileNavOpen, (open) => (bodyLocked.value = open));
watch(
  () => route.fullPath,
  () => (isMobileNavOpen.value = false),
);
</script>

<template>
  <header class="header" :class="{ 'header--scrolled': isScrolled }">
    <div class="header__inner">
      <RouterLink to="/" class="logo" aria-label="Game Shelf home">
        <span class="logo__mark"><IconBook class="logo__icon" /></span>
        <span class="logo__text"
          >Game<span class="text-gradient">Shelf</span></span
        >
      </RouterLink>

      <nav
        class="nav"
        :class="{ 'nav--open': isMobileNavOpen }"
        aria-label="Main"
      >
        <ul id="primary-nav" class="nav__list">
          <li v-for="link in links" :key="link.label">
            <RouterLink :to="link.to" class="nav__link">{{
              link.label
            }}</RouterLink>
          </li>
          <li>
            <RouterLink :to="{ name: 'about' }" class="nav__link"
              >About</RouterLink
            >
          </li>
        </ul>
      </nav>

      <div class="header__search">
        <NavSearch />
      </div>

      <RouterLink :to="{ name: 'shelf' }" class="shelf-link" title="My Shelf">
        <AppIcon name="bookmark" :size="18" />
        <span class="shelf-link__label">My Shelf</span>
        <Transition name="badge">
          <span
            v-if="shelf.count > 0"
            :key="shelf.count"
            class="shelf-link__count"
          >
            {{ shelf.count }}
          </span>
        </Transition>
      </RouterLink>

      <button
        class="burger btn btn--ghost btn--icon"
        aria-controls="primary-nav"
        :aria-expanded="isMobileNavOpen"
        :aria-label="isMobileNavOpen ? 'Close menu' : 'Open menu'"
        @click="isMobileNavOpen = !isMobileNavOpen"
      >
        <AppIcon :name="isMobileNavOpen ? 'x' : 'menu'" :size="20" />
      </button>
    </div>
    <Transition name="fade">
      <div
        v-if="isMobileNavOpen"
        class="scrim"
        aria-hidden="true"
        @click="isMobileNavOpen = false"
      ></div>
    </Transition>
  </header>
</template>

<style lang="scss" scoped>
@use "@/assets/style/component.scss" as component;

$desktop: 1100px;

.header {
  position: sticky;
  top: 0;
  z-index: 100;
  transition:
    background-color 0.3s,
    border-color 0.3s,
    backdrop-filter 0.3s;
  border-bottom: 1px solid transparent;

  &--scrolled {
    background: rgb(11 11 18 / 0.72);
    backdrop-filter: blur(18px) saturate(150%);
    -webkit-backdrop-filter: blur(18px) saturate(150%);
    border-color: var(--border-glass);

    .header__inner {
      padding-block: 0.6rem;
    }
  }
}

.header__inner {
  @include component.container;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding-block: 1.2rem;
  transition: padding 0.3s;

  @media (min-width: $desktop) {
    gap: 2.4rem;
  }
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--neutral-text);
  flex-shrink: 0;

  &:hover {
    color: var(--neutral-text);

    .logo__mark {
      transform: rotate(-8deg) scale(1.05);
    }
  }
}

.logo__mark {
  display: grid;
  place-items: center;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: var(--r-md);
  background: var(--brand-gradient);
  box-shadow: var(--glow-accent);
  transition: transform 0.3s var(--ease-out);
}

.logo__icon {
  width: 1.4rem;
  height: 1.4rem;
  color: white;
}

.logo__text {
  display: none;

  @media (min-width: 600px) {
    display: inline;
  }
}

.nav {
  position: fixed;
  top: 0;
  right: 0;
  height: 100dvh;
  width: min(80%, 340px);
  padding: 7.2rem 2rem 2rem;
  background: var(--surface-glass-strong);
  backdrop-filter: blur(24px);
  border-left: 1px solid var(--border-glass);
  transform: translateX(100%);
  transition: transform 0.3s var(--ease-out);
  z-index: 101;

  &--open {
    transform: none;
  }

  @media (min-width: $desktop) {
    position: static;
    height: auto;
    width: auto;
    padding: 0;
    background: none;
    backdrop-filter: none;
    border: none;
    transform: none;
  }
}

.nav__list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  @media (min-width: $desktop) {
    flex-direction: row;
    gap: 0.4rem;
  }
}

.nav__link {
  display: block;
  padding: 0.5rem 0.9rem;
  border-radius: 999px;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--neutral-text-secondary);
  transition:
    color 0.2s,
    background-color 0.2s;

  &:hover {
    color: var(--neutral-text);
    background: rgb(255 255 255 / 0.06);
  }

  &.router-link-exact-active {
    color: var(--neutral-text);
    background: var(--accent-transparent);
  }

  @media (min-width: $desktop) {
    font-size: 1rem;
    white-space: nowrap;
  }
}

.header__search {
  flex: 1;
  max-width: 420px;
  margin-left: auto;
}

.shelf-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 0.9rem;
  border-radius: 999px;
  border: 1px solid var(--border-glass);
  background: rgb(255 255 255 / 0.05);
  color: var(--neutral-text);
  font-weight: 600;
  flex-shrink: 0;

  &:hover,
  &.router-link-active {
    color: var(--neutral-text);
    border-color: var(--accent);
    background: var(--accent-transparent);
  }
}

.shelf-link__label {
  display: none;

  @media (min-width: 768px) {
    display: inline;
  }
}

.shelf-link__count {
  display: grid;
  place-items: center;
  min-width: 1.4rem;
  height: 1.4rem;
  padding: 0 0.35rem;
  border-radius: 999px;
  font-size: 0.8rem;
  background: var(--accent);
  color: white;
}

.burger {
  z-index: 102;
  flex-shrink: 0;

  @media (min-width: $desktop) {
    display: none;
  }
}

.scrim {
  position: fixed;
  inset: 0;
  height: 100dvh;
  background: rgb(0 0 0 / 0.5);
  z-index: 100;

  @media (min-width: $desktop) {
    display: none;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.badge-enter-active {
  animation: badge-pop 0.4s var(--ease-out);
}

.badge-leave-active {
  display: none;
}

@keyframes badge-pop {
  from {
    transform: scale(0.4);
  }
}
</style>
