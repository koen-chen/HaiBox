export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  runtimeConfig: {
    public: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_KEY: process.env.SUPABASE_KEY
    }
  },
  css: ['animate.css/animate.min.css', '~/assets/styles/main.scss'],
  imports: {
    dirs: ['stores']
  },
  modules: [
    '@element-plus/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@nuxtjs/google-fonts',
    'nuxt-icon',
    '@vueuse/nuxt',
    '@vueuse/motion/nuxt'
  ],
  i18n: {
    locales: [
      {
        code: 'en',
        file: 'en.yaml'
      },
      {
        code: 'zh',
        file: 'zh.yaml'
      }
    ],
    langDir: 'locales',
    defaultLocale: 'en'
  },

  elementPlus: {
    importStyle: 'scss'
  },
  googleFonts: {
    families: {
      "Roboto+Mono": [400, 500],
      "Playfair+Display": [400, 900],
      "Montserrat": [600, 800, 900]
    }
  },
  pinia: {
    autoImports: [
      "defineStore",
      "storeToRefs",
    ],
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/styles/variables.scss" as *; @use "@/assets/styles/minix.scss" as *;`,
        },
      },
    },
  },
})
