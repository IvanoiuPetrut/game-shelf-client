import type { Directive } from "vue";
import { prefersReducedMotion } from "./motion";

let observer: IntersectionObserver | undefined;

const getObserver = () => {
  observer ??= new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer?.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
  );
  return observer;
};

// Fades an element up into place the first time it scrolls into view.
export const vReveal: Directive<HTMLElement> = {
  mounted(el) {
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) return;
    el.classList.add("reveal");
    getObserver().observe(el);
  },
  unmounted(el) {
    observer?.unobserve(el);
  },
};
