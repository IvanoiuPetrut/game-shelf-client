<template>
  <main class="not-found page container">
    <p class="not-found__code" aria-hidden="true">404</p>
    <h1>This shelf is empty</h1>
    <p class="not-found__text">
      We couldn't find the page you were looking for. It may have moved, or it
      never existed.
    </p>
    <div class="not-found__actions">
      <RouterLink to="/" class="btn btn--lg">Back home</RouterLink>
      <RouterLink :to="{ name: 'surprise' }" class="btn btn--lg btn--ghost">
        Find a random game
      </RouterLink>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-block: 6.4rem;
}

.not-found__code {
  font-family: var(--font-display);
  font-size: clamp(6rem, 22vw, 14rem);
  font-weight: 700;
  line-height: 1;
  background: var(--brand-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 0 40px rgb(139 92 246 / 0.4));
  animation: float 5s ease-in-out infinite;
}

h1 {
  font-size: clamp(1.6rem, 4vw, 2.4rem);
  margin-top: 1.2rem;
}

.not-found__text {
  max-width: 44ch;
  margin-top: 0.8rem;
  color: var(--neutral-text-secondary);
}

.not-found__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-top: 2.4rem;
}

@keyframes float {
  50% {
    transform: translateY(-12px);
  }
}
</style>
