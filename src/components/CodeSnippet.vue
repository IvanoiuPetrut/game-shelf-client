<script setup lang="ts">
import Prism from "prismjs";
import { onMounted } from "vue";

onMounted(() => {
  Prism.highlightAll();
});
</script>

<template>
  <div class="code__snippet">
    <div class="header">
      <h4 class="title">Title</h4>
      <button class="btn">Coppy</button>
    </div>
    <pre class="language-javascript">
      <code>
        console.log("Hello World")
        console.log("Hello World")
      </code>
    </pre>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/style/colors.scss" as colors;
.code__snippet {
  background: colors.$neutral-bg-secondary;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title {
  font-size: 1.6rem;
  font-weight: 500;
  color: colors.$neutral-text;
}

pre,
code {
  background-color: white;
}
</style>
