<template>
  <div>
    <NavBar />
    <NuxtLayout :name="layoutName">
      <UApp>
        <NuxtPage />
      </UApp>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import NavBar from "~/components/common/NavBar.vue";
const route = useRoute();

const layoutName = ref<"default" | "dashboard">("default");

watch(
  () => route.path,
  (newPath) => {
    if (newPath.startsWith("/timer")) {
      layoutName.value = "dashboard";
    } else {
      layoutName.value = "default";
    }
  },
  { immediate: true } // run once on mount too
);
</script>
