<script setup lang="ts">
import { ref } from "vue";
import Authentication from "@/services/AuthenticationService";

const nickname = ref("");
const email = ref("");
const password = ref("");
const passwordConfirm = ref("");

// async submit function
const submit = async () => {
  const response = await Authentication.register({
    nickname: nickname.value,
    email: email.value,
    password: password.value,
    passwordConfirm: passwordConfirm.value,
  });
  console.log(response.data);
};
</script>

<template>
  <main>
    <div class="register">
      <h1>Start using GameShelf 😎</h1>
      <form @submit.prevent="submit" class="form">
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
          <label for="passwordConfirm" class="form__label"
            >Confirm Password</label
          >
          <input
            type="password"
            class="form__input"
            id="passwordConfirm"
            v-model="passwordConfirm"
          />
        </div>
        <button type="submit" class="btn form__btn" @click="submit">
          Register
        </button>
      </form>
    </div>
  </main>
</template>

<style lang="scss" scoped>
@use "@/assets/style/colors.scss" as colors;

.register {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
  margin-top: 3.2rem;
}

h1 {
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 1.6rem;

  @media (min-width: 600px) {
    font-size: 2.4rem;
  }
}

.form {
  background-color: colors.$neutral-bg-secondary;
  padding: 1.2rem 1.8rem;
  border-radius: 11px;
  width: min(90%, 32rem);

  @media (min-width: 600px) {
    padding: 2.4rem 3.2rem;
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-bottom: 1.2rem;
  }

  &__label {
    font-size: 1.2rem;
    color: colors.$neutral-text-secondary;
  }

  &__input {
    padding: 0.4rem 0.8rem;
    border: 1px solid colors.$neutral-text-secondary;
    background-color: colors.$neutral-bg-secondary;
    border-radius: 7px;
    font-size: 1.4rem;
    color: currentColor;

    &:focus {
      outline: none;
      border-color: colors.$primary;
    }
  }

  &__btn {
    width: 100%;
    margin-top: 1.2rem;
    padding: 1rem 0;
    font-size: 1rem;
    font-weight: bold;
    text-transform: uppercase;
  }
}
</style>
