// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
    },
    /** 静态资源前缀 */
    buildAssetsDir: "/app/",
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
    "@nuxt/content",
    "@vueuse/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxt/eslint",
    "@nuxtjs/i18n",
  ],
  plugins: [{ src: "~/utils/encrypt.ts", ssr: false, mode: "client" }],
  i18n: {
    vueI18n: "./i18n/i18n.config.ts", // if you are using custom path, default
    lazy: true,
    locales: [
      { code: "zh-CN", name: "🇨🇳 中文", language: "zh-CN", files: ["zh-CN.json"] },
      { code: "en-US", name: "🇬🇧 English", language: "en-US", files: ["en-US.json"] },
    ],
    defaultLocale: "zh-CN",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "lang",
      cookieCrossOrigin: true,
      redirectOn: "root", // recommended
    },
  },
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
    // icons: ["heroicons", "iconoir"],
  },
  nitro: {
    experimental: {
      asyncContext: true,
    },
  },
  compatibilityDate: "2024-12-23",
});
