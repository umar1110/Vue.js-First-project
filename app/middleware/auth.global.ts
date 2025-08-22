import { storeToRefs } from "pinia";

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();
  const { isAuthenticated, loading } = storeToRefs(authStore);

  if (
    !isAuthenticated.value &&
    !loading.value &&
    to.path !== "/auth/login" &&
    to.path !== "/auth/register"
  ) {
    return navigateTo("/auth/login");
  }
  if (
    isAuthenticated.value &&
    !loading.value &&
    (to.path === "/auth/login" || to.path === "/auth/register")
  ) {
    return navigateTo("/");
  }
});
