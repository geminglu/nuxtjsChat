// https://nuxt.com/docs/api/configuration/nuxt-config
import config from "./config/index";

export default defineNuxtConfig({
  devServer: {
    port: config.port,
  },
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
    },
  },
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  typescript: {
    typeCheck: true,
  },
  modules: [
    "@pinia/nuxt",
    "@nuxt/ui",
    "@nuxtjs/eslint-module",
    "@nuxt/content",
    "@vueuse/nuxt",
    "nuxt-icon",
    "@pinia-plugin-persistedstate/nuxt",
  ],
  piniaPersistedstate: {
    cookieOptions: {
      sameSite: "strict",
    },
    storage: "localStorage",
  },
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],
  content: {
    api: {
      baseURL: "/api/content",
    },
  },
  ui: {
    icons: ["heroicons", "iconoir"],
  },
  nitro: {
    experimental: {
      asyncContext: true,
    },
  },
});
