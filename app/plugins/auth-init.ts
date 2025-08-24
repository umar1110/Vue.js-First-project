// plugins/auth.client.ts
import { useAuthStore } from "~/stores/auth.store";

export default defineNuxtPlugin(async (nuxtApp) => {
  const authStore = useAuthStore();

  // only run once
  await authStore.init();
});
