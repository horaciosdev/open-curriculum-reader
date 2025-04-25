// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['@/assets/css/print.css'],
  nitro: {
    storage: {
      myFileSystem: { // pass this key - 'myFileSystem' - into useStorage while accessing the .json file
        driver: 'fs',
        base: 'public/server/',
      }
    }
  },
  app: {
    head: {
      title: 'Editor de Currículo',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  }
})