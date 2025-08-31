<script setup lang="ts">
const route = useRoute();
const projectDetailsStore = useProjectDetailsStore();
const { projectDetails, loading: projectDetailsLoading } =
  storeToRefs(projectDetailsStore);
</script>

<template>
  <NuxtLayout name="project-details">
    <div v-if="projectDetailsLoading">
      <USkeleton class="h-16 w-full" />
      <USkeleton class="h-[70vh] my-4 w-full" />
    </div>
    <div v-else-if="projectDetails" class="p-16">
      <h2 class="text-2xl font-medium my-3">Project Description:</h2>
      <p>{{ projectDetails.description }}</p>
    </div>
  </NuxtLayout>
</template>
