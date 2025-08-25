<template>
  <h2 class="text-3xl font-bold mb-4">Welcome to the Dashboard</h2>
  <p>This is the main dashboard page content.</p>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});

const authStore = useAuthStore();
const { isAuthenticated, loading } = storeToRefs(authStore);
</script>
