<template>
  <footer class="footer">
    <div class="footer__section">
      <div>
        <h4>Join the community</h4>
      </div>
      <div>
        <h4>Follow us</h4>
        <ul>
          <li>
            <a href="https://twitter.com/hashtag/100DaysOfCode" target="_blank"
              >Twitter</a
            >
          </li>
          <li>
            <a
              href="https://www.facebook.com/groups/100daysofcode/"
              target="_blank"
              >Facebook</a
            >
          </li>
          <li>
            <a href="https://www.instagram.com/100daysofcode/" target="_blank"
              >Instagram</a
            >
          </li>
        </ul>
      </div>
    </div>
    <div class="footer__section">
      <div>
        <h3>GameShelf</h3>
        <p>
          GameShelf is a project created by
          <a
            href="
            https://www.linkedin.com/in/andrew-mcintosh-5b1b3b1b1/
            "
            target="_blank"
            >Petrut Ivanoiu</a
          >
        </p>
        <p>See my projects on my <a href="#" target="_blank">Github Page</a></p>
        <p>
          Source of data is <a href="https://rawg.io/" target="_blank">RAWG</a>
        </p>
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
    </div>
    <p class="coppyright">&copy; 2022 GameShelf. All rights reserved.</p>
  </footer>
</template>
