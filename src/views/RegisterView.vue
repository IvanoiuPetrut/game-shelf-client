<script setup lang="ts">
import { ref } from "vue";
import Authentication from "@/services/AuthenticationService";
import BaseInput from "@/components/BaseInput.vue";
import BaseButton from "@/components/BaseButton.vue";

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
        <BaseInput v-model="nickname" label="Nickname" type="text"></BaseInput>
        <BaseInput
          v-model="email"
          label="E-mail address"
          type="email"
        ></BaseInput>
        <BaseInput
          v-model="password"
          label="Password"
          type="password"
        ></BaseInput>
        <BaseInput
          v-model="passwordConfirm"
          label="Confirm password"
          type="password"
        ></BaseInput>
        <BaseButton class="btn__form" type="submit" @click="submit">
          <template #text> Register </template>
        </BaseButton>
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
}

.form >>> .form__btn {
  width: 100%;
  margin-top: 1.2rem;
  padding: 1rem 0;
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
}
</style>
