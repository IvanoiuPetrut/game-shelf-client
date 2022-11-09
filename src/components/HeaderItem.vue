<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

const windowWidth = ref(window.innerWidth);
const windowHeight = ref(Math.floor(window.innerHeight));

const columns = computed(() => {
  return Math.floor(windowWidth.value / 50);
});

const rows = computed(() => {
  return Math.floor(windowHeight.value / 50);
});

const handleResize = () => {
  windowWidth.value = window.innerWidth;
  windowHeight.value = Math.floor(window.innerHeight / 7);
  console.log(windowHeight.value);
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<template>
  <h1>GameShelf</h1>
  <div>
    <p>Window width: {{ windowWidth }}</p>
    <p>Window height: {{ windowHeight }}</p>
    <p>Columns: {{ columns }}</p>
    <p>Rows: {{ rows }}</p>
  </div>
  <div class="wrapper">
    <div v-for="row in rows" :key="row">
      <div v-for="column in columns" :key="column">
        <div class="box"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(v-bind(columns), 50px);
  grid-template-rows: repeat(v-bind(rows), 50px);
}
.box {
  width: 50px;
  height: 50px;
  background-color: #ccc;
  display: inline-block;
}
</style>
