<script setup>
definePageMeta({
  layout: "dashboard",
});
import { useRoute } from "vue-router";

const route = useRoute();
const projectId = route.params.id;

const tabs = [
  { name: "Dashboard", path: `/projects/${projectId}/dashboard` },
  { name: "Tasks", path: `/projects/${projectId}/tasks` },
  { name: "Team", path: `/projects/${projectId}/team` },
];
</script>

<template>
  <div class="flex">
    <!-- Sidebar -->
   

    <!-- Main content -->
    <div class="flex-1 flex flex-col">
      <!-- Top navbar (tab switcher) -->
      <nav class="flex space-x-6 border-b p-4 bg-white text-black">
        <NuxtLink
          v-for="tab in tabs"
          :key="tab.path"
          :to="tab.path"
          class="px-3 py-2 font-medium"
          :class="{ 'border-b-2 border-blue-500 text-blue-600': route.path === tab.path }"
        >
          {{ tab.name }}
        </NuxtLink>
      </nav>

      <!-- Render child page -->
      <div class="p-6">
        <slot :projectId="projectId" />
      </div>
    </div>
  </div>
</template>
