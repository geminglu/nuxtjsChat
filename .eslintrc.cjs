module.exports = {
  root: true,
  extends: ["@nuxt/eslint-config", "plugin:prettier/recommended", "prettier"],
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
};