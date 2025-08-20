<script setup lang="ts">
import { ref, onMounted } from "vue";

const data = ref<{ status: number; message: string } | null>(null);
const loading = ref(true);

onMounted(async () => {
  try {
    data.value = await $fetch("/api/health");
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="h-screen flex items-center justify-center">
    <div v-if="loading">Loading...</div>
    <div v-else>{{ data?.message }}</div>
  </div>
</template>
