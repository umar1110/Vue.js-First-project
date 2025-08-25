<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="text-center">
      <h1 class="text-2xl font-bold text-gray-800">Processing authentication...</h1>
      <p class="text-gray-600">Please wait while we sign you in.</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "~/stores/auth.store";
import { navigateTo } from "#app";

const authStore = useAuthStore();

onMounted(async () => {
  await authStore.init(); // Refresh session after OAuth callback
  navigateTo("/"); // Redirect to home after processing
});
</script>
