import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { registerDirectives } from "./directives";

import "./assets/style/main.scss";

const app = createApp(App);

app.use(createPinia());
app.use(router);
registerDirectives(app);

app.mount("#app");
