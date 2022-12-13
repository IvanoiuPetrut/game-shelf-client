<template>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <router-link :to="{ name: 'register' }">Register</router-link>
    <router-link :to="{ name: 'login' }">Login</router-link>
    <router-link :to="{ name: 'about' }">About</router-link>
  </nav>
</template>
