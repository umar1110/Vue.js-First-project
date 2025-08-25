import { storeToRefs } from "pinia";
import { useAuthStore } from "~/stores/auth.store";

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();
  const { isAuthenticated, loading } = storeToRefs(authStore);

  // // Ensure auth store is initialized
  // if (loading.value) {
  //   await authStore.init();
  // }

  console.log("Middleware triggered for path:", to.path, {
    isAuthenticated: isAuthenticated.value,
    loading: loading.value,
  });

  // Redirect unauthenticated users trying to access /timer
  if (!isAuthenticated.value && to.path === "/timer") {
    console.log("Redirecting to /auth/login: User not authenticated");
    return navigateTo("/auth/login");
  }

  // Redirect authenticated users away from login/register pages
  if (
    isAuthenticated.value &&
    (to.path === "/auth/login" || to.path === "/auth/register")
  ) {
    console.log("Redirecting to /: User authenticated on login/register page");
    return navigateTo("/");
  }
});