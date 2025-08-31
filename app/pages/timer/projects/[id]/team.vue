<template>
  <NuxtLayout name="project-details">
    <div>team: {{ projectId }}</div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const route = useRoute();
const projectId = route.params.id;
</script>
