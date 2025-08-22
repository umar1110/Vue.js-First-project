// // plugins/auth-init.ts
// import { useAuthStore } from "~/stores/auth.store";

// export default defineNuxtPlugin(async () => {
//   const authStore = useAuthStore();
//   if (authStore.loading) {
//       authStore.init().catch((error) => {
//           console.error("Error initializing auth store:", error);
//       }).then(() => {
//           console.log("auth init completed");
//       });
//   }
// });
