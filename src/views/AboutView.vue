<script setup lang="ts"></script>

<template>
  <div class="about__wrapper">
    <h1>About Our Game Shelf App</h1>
    <p>
      Our game shelf app is a platform where users can browse and discover a
      wide variety of games. Our main features include a user-friendly
      interface, detailed game information, and user reviews.
    </p>
    <h2>Meet the Team</h2>
    <p class="secondary">
      Our team is made up of experienced gaming enthusiasts who have a passion
      for creating high-quality apps. Learn more about our team members and
      their backgrounds <a href="#">here</a>.
    </p>
    <h2>Contact Us</h2>
    <p class="secondary">
      If you have any questions or feedback about our app, please don't hesitate
      to reach out to us. You can contact us via email at
      <a href="#">support@gameshelfapp.com</a> or through our social media
      channels <a href="#">Twitter</a> and <a href="#">Facebook</a>.
    </p>
    <h2>Resources</h2>
    <p class="secondary">
      For more information about our app, check out our
      <a href="#">FAQ</a> page and <a href="#">blog</a>.
    </p>
    <h2>Legal Information</h2>
    <p class="secondary">
      For terms of service and privacy policy please refer to
      <a href="#">legal page</a>.
    </p>
    <h2>Testimonials</h2>
    <p class="secondary">
      Check out what other users have to say about our app
      <a href="#">here</a>.
    </p>
    <h2>Roadmap</h2>
    <p class="secondary">
      We are constantly working to improve our app and add new features. Check
      out our <a href="#">roadmap</a> to see what's coming up next.
    </p>
    <h2>Partners and Sponsors</h2>
    <p class="secondary">
      We are proud to be partnered with and sponsored by some of the top
      companies in the gaming industry. Check out our
      <a href="#">partners and sponsors</a> page to learn more.
    </p>
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/style/colors.scss" as colors;
@use "@/assets/style/component.scss" as component;

.about__wrapper {
  @include component.container;
}

h1 {
  font-size: 2rem;
  margin-bottom: 3.2rem;
  font-weight: 600;
  letter-spacing: 1px;

  @media (min-width: 768px) {
    font-size: 2.4rem;
  }
}

h2 {
  display: inline-block;
  letter-spacing: 1px;
  font-weight: 600;
  margin-bottom: 1.2rem;

  // before
  &::after {
    content: "";
    display: block;
    width: 100%;
    height: 3px;
    background-color: colors.$primary;
    margin-bottom: 1.2rem;
    border-radius: 2px;
  }
}

p {
  font-size: 1.2rem;
  line-height: 2.4rem;
  margin-bottom: 2.4rem;
}

p.secondary {
  color: colors.$neutral-text-secondary;
}
</style>
