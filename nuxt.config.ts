import { defineNuxtConfig } from 'nuxt3';

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  server: {
    port: 8000,
  },
  buildModules: ['@vueuse/nuxt'],
});
