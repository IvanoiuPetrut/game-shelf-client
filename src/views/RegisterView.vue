<script setup></script>

<template>
  <main>
    <h1>Start using GameShelf 😎</h1>
    <form @submit.prevent="register" class="form">
      <div class="form__field">
        <label for="nickname" class="form__label">Nickname</label>
        <input
          type="text"
          class="form__input"
          id="nickname"
          v-model="nickname"
        />
      </div>
      <div class="form__field">
        <label for="email" class="form__label">E-mail address</label>
        <input type="text" class="form__input" id="email" v-model="email" />
      </div>
      <div class="form__field">
        <label for="password" class="form__label">Password</label>
        <input
          type="password"
          class="form__input"
          id="password"
          v-model="password"
        />
      </div>
      <div class="form__field">
        <label for="password2" class="form__label">Confirm Password</label>
        <input
          type="password"
          class="form__input"
          id="password2"
          v-model="password2"
        />
      </div>
      <div class="form__field">
        <button type="submit">Register</button>
      </div>
    </form>
  </main>
</template>

<style lang="scss" scoped></style>
