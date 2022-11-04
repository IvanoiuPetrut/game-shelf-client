<script setup lang="ts">
import TheWelcome from "../components/TheWelcome.vue";
import GameItem from "../components/GameItem.vue";
</script>

<template>
  <main>
    <TheWelcome />
    <GameItem :game-id="'187'" />
  </main>
</template>
