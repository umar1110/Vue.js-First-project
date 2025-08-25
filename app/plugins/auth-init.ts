import { defineNuxtPlugin } from "#imports";
import { useAuthStore } from "~/stores/auth.store";

export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore();
  await authStore.init();
  return {
    provide: {
      auth: authStore,
    },
  };
});