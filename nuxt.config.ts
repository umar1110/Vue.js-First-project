// nuxt.config.ts
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  modules: [
    "@pinia/nuxt",
    "@nuxt/ui",
  
  ],  
  css: ["~/assets/css/index.css"],
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