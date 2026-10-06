import type { App } from "vue";
import { vTilt } from "./tilt";
import { vReveal } from "./reveal";

export const registerDirectives = (app: App) => {
  app.directive("tilt", vTilt);
  app.directive("reveal", vReveal);
};

declare module "vue" {
  interface GlobalDirectives {
    vTilt: typeof vTilt;
    vReveal: typeof vReveal;
  }
}
