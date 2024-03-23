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
  typescript: {
    typeCheck: true,
  },
  modules: ["@pinia/nuxt", "@nuxt/ui", "@nuxtjs/eslint-module", "@nuxt/content"],
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
});
