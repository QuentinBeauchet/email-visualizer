module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-strongly-recommended",
    "plugin:prettier-vue/recommended",
  ],
  rules: {
    "vue/no-unused-vars": "error",
    "vue/v-on-event-hyphenation": [
      1,
      "always",
      {
        autofix: true,
        ignore: [],
      },
    ],
    "vue/require-default-prop": "off",
  },
  env: {
    node: true,
  },
  root: true,
  parserOptions: {
    parser: "babel-eslint",
  },
};
