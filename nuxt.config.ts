// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxtjs/tailwindcss'],
  runtimeConfig: {
    MY_GEMINI_API_KEY_VARIABLE: process.env.MY_GEMINI_API_KEY_VARIABLE,
  },
})
