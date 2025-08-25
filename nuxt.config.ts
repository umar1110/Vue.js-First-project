// nuxt.config.ts
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  modules: ["@pinia/nuxt", "@nuxt/ui", "@nuxtjs/supabase"],
  css: ["~/assets/css/index.css"],
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirect: false, // Handle redirects manually with middleware
    redirectOptions: {
      login: "/auth/login",
      callback: "/auth/callback",
      exclude: ["/auth/*"], // Exclude auth routes from redirects
    },
  },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabasekey: process.env.SUPABASE_KEY,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});