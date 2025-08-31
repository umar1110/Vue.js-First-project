<script setup lang="ts">
import { useRoute } from "vue-router";
import routes from "~/constants/routes";

const route = useRoute();
const projectId = route.params.id;

const tabs = [
  {
    name: "Dashboard",
    path: routes.client.project.indexSingle(projectId as string),
  },
  { name: "Tasks", path: routes.client.project.tasks(projectId as string) },
  { name: "Team", path: routes.client.project.team(projectId as string) },
];

const projectDetailsStore = useProjectDetailsStore();
const {
  projectId: prevProjectId,
  errorMessage,
  projectDetails,
  loading,
} = storeToRefs(projectDetailsStore);
const { fetchProjectDetails, resetDetails } = projectDetailsStore;
const toast = useToast();
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      fetchProjectDetails(newId as string);
    } else {
      resetDetails();
    }
  },
  { immediate: true }
);

watch(errorMessage, (newErrorMessage) => {
  if (newErrorMessage) {
    toast.add({
      color: "error",
      title: newErrorMessage,
    });
    navigateTo(routes.client.project.index);
  }
});
</script>

<template>
  <div class="flex">
    <div class="flex-1 flex flex-col">
      <header
        class="flex border-b border-gray-700 items-center space-x-3 px-4 py-2"
      >
        <NuxtLink
          :to="routes.client.project.index"
          class="text-sm text-white hover:underline"
        >
          Back to Projects
        </NuxtLink>
        <span> > </span>
        <NuxtLink
          v-if="!loading && projectDetails"
          :to="routes.client.project.indexSingle(projectId as string)"
          class="text-sm text-white hover:underline"
        >
          {{ projectDetails?.name }}
        </NuxtLink>
      </header>
      <!-- Top navbar (tab switcher) -->
      <nav
        class="flex space-x-6 border-b border-gray-700 px-4 py-2 bg-[#141414] text-gray-500"
      >
        <NuxtLink
          v-for="tab in tabs"
          :key="tab.path"
          :to="tab.path"
          class="px-3 py-2 font-medium"
          :class="{
            'border-b-2 border-white text-white': route.path === tab.path,
          }"
        >
          {{ tab.name }}
        </NuxtLink>
      </nav>

      <!-- Render child page -->
      <div class="p-6">
        <slot />
      </div>
    </div>
  </div>
</template>
