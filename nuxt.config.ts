// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
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
  devServer: {
    host: "0.0.0.0",
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
  css: ["~/style/index.less"],
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
