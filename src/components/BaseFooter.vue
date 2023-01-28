<script setup lang="ts">
import IconBook from "./icons/IconBook.vue";
</script>

<template>
  <div class="footer__wrapper">
    <footer class="footer">
      <div class="footer__section">
        <div>
          <h3>Join the community</h3>
          <ul>
            <li>
              <a href="#">Twitter</a>
            </li>
            <li>
              <a href="#">Facebook</a>
            </li>
            <li>
              <a href="#">Instagram</a>
            </li>
          </ul>
        </div>
        <div>
          <h3>Useful Links</h3>
          <ul>
            <li>
              <router-link to="/">Home</router-link>
            </li>
            <li>
              <router-link
                :to="{ name: 'category', params: { category: 'default' } }"
              >
                Categories
              </router-link>
            </li>
            <li>
              <router-link :to="{ name: 'about' }">About</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'register' }">Register</router-link>
            </li>
          </ul>
        </div>
        <div class="span--2">
          <h3>Game Shelf</h3>
          <div class="description">
            <p>
              Game Shelf is a project created by
              <a
                href="
            https://www.linkedin.com/in/andrew-mcintosh-5b1b3b1b1/
            "
                target="_blank"
                >Petrut</a
              >
            </p>
            <p>
              See my projects on my <a href="#" target="_blank">Github Page</a>
            </p>
            <p>
              Source of data is
              <a href="https://rawg.io/" target="_blank">RAWG</a>
            </p>
          </div>
        </div>
      </div>
      <p class="coppyright">&copy; 2022 GameShelf. All rights reserved.</p>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/style/colors.scss" as colors;
@use "@/assets/style/component.scss" as component;

.footer__wrapper {
  background-color: colors.$neutral-bg-secondary;
  padding-top: 4rem;
  margin-top: 9.6rem;
}

.footer {
  @include component.container;
}

.footer__section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.4rem;

  @media (min-width: 1000px) {
    grid-template-columns: repeat(3, 1fr);
  }

  h3 {
    font-size: 1.6rem;
    margin-bottom: 1.6rem;
    position: relative;

    &::after {
      content: "";
      display: block;
      width: 6.4rem;
      height: 0.2rem;
      background-color: colors.$primary;
      margin-top: 0.8rem;
      border-radius: 7px;
      position: absolute;
      bottom: -4px;
    }
  }
}

.description {
  color: colors.$neutral-text-secondary;
}

.coppyright {
  text-align: center;
  margin-top: 2.4rem;
  padding: 0.8rem 0;
  color: colors.$neutral-text-secondary;

  @media (min-width: 1000px) {
    margin-top: 4rem;
  }
}
</style>
