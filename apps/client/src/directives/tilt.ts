import type { Directive } from "vue";
import { prefersReducedMotion } from "./motion";

type TiltElement = HTMLElement & { _tiltCleanup?: () => void };

// Tilts an element in 3D towards the pointer, with a soft glare following it.
// The value is the maximum rotation in degrees.
export const vTilt: Directive<TiltElement, number | undefined> = {
  mounted(el, binding) {
    const canHover = window.matchMedia("(hover: hover)").matches;
    if (prefersReducedMotion() || !canHover) return;

    const maxRotation = binding.value ?? 8;
    el.classList.add("tilt");

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      el.style.setProperty("--tilt-x", `${(0.5 - y) * maxRotation}deg`);
      el.style.setProperty("--tilt-y", `${(x - 0.5) * maxRotation}deg`);
      el.style.setProperty("--glare-x", `${x * 100}%`);
      el.style.setProperty("--glare-y", `${y * 100}%`);
    };

    const onLeave = () => {
      el.style.setProperty("--tilt-x", "0deg");
      el.style.setProperty("--tilt-y", "0deg");
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    el._tiltCleanup = () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  },
  unmounted(el) {
    el._tiltCleanup?.();
  },
};
