<script setup lang="ts">
import IconBook from "./icons/IconBook.vue";

const year = new Date().getFullYear();
</script>

<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__brand">
        <RouterLink to="/" class="footer__logo">
          <IconBook class="footer__icon" /> Game Shelf
        </RouterLink>
        <p class="footer__tagline">
          Discover games, see what's coming next and keep track of everything
          you play.
        </p>
      </div>

      <div>
        <h3>Explore</h3>
        <ul>
          <li>
            <RouterLink :to="{ name: 'category', params: { category: 'all' } }">
              Browse games
            </RouterLink>
          </li>
          <li>
            <RouterLink :to="{ name: 'upcoming' }"
              >Upcoming releases</RouterLink
            >
          </li>
          <li>
            <RouterLink :to="{ name: 'surprise' }">Surprise me</RouterLink>
          </li>
          <li><RouterLink :to="{ name: 'shelf' }">My Shelf</RouterLink></li>
          <li><RouterLink :to="{ name: 'about' }">About</RouterLink></li>
        </ul>
      </div>

      <div>
        <h3>Credits</h3>
        <ul>
          <li>
            Game data from
            <a href="https://rawg.io/" target="_blank" rel="noopener">RAWG</a>
          </li>
          <li>
            Made by
            <a
              href="https://www.linkedin.com/in/ivanoiu-petrut-dragos/"
              target="_blank"
              rel="noopener"
              >Petrut</a
            >
          </li>
          <li>
            <a
              href="https://github.com/IvanoiuPetrut"
              target="_blank"
              rel="noopener"
            >
              More projects on GitHub
            </a>
          </li>
        </ul>
      </div>
    </div>
    <p class="footer__copyright">&copy; {{ year }} Game Shelf</p>
  </footer>
</template>

<style lang="scss" scoped>
@use "@/assets/style/component.scss" as component;

.footer {
  margin-top: 9.6rem;
  border-top: 1px solid var(--border-glass);
  background: linear-gradient(180deg, rgb(21 22 33 / 0.6), var(--neutral-bg));
}

.footer__inner {
  @include component.container;
  display: grid;
  gap: 3.2rem;
  padding-block: 4.8rem 3.2rem;

  @media (min-width: 800px) {
    grid-template-columns: 2fr 1fr 1fr;
  }

  h3 {
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--neutral-text-secondary);
    margin-bottom: 1.2rem;
  }

  ul {
    display: grid;
    gap: 0.6rem;
    color: var(--neutral-text-secondary);
  }

  a {
    color: var(--neutral-text);

    &:hover {
      color: var(--accent-strong);
    }
  }
}

.footer__logo {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 700;
}

.footer__icon {
  width: 1.6rem;
  height: 1.6rem;
  color: var(--accent-strong);
}

.footer__tagline {
  margin-top: 0.8rem;
  max-width: 36ch;
  color: var(--neutral-text-secondary);
}

.footer__copyright {
  padding: 1.6rem;
  text-align: center;
  font-size: 0.9rem;
  color: var(--neutral-text-secondary);
  border-top: 1px solid var(--border-glass);
}
</style>
