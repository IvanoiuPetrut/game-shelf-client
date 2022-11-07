<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import axios from "axios";
import { API_URL } from "@/api";

const props = defineProps<{
  id: string;
}>();

const game = ref({});

const fetchGame = async () => {
  axios.get(`${API_URL}/${props.id}`).then((res) => {
    game.value = res.data;
    console.log(res.data);
  });
};

onBeforeMount(() => {
  fetchGame();
});
</script>

<template>
  <main>
    <h1>Best Game Ever</h1>
    <p>{{ $route.params.id }}</p>
    <p>{{ props.id }}</p>
  </main>
</template>
