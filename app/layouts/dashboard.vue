<template>
  <div class="flex h-screen text-white bg-[#050505]">
    <aside class="w-64 bg-[#141414] shadow-lg flex flex-col">
      <div class="h-16 flex items-center justify-center border-b">
        <h1 class="text-xl font-bold">Dashboard</h1>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4 space-y-2">
        <NuxtLink
          v-for="item in menu"
          :key="item.name"
          :to="item.routes[0]"
          class="block px-4 py-2 rounded hover:bg-[#292929]"
          :class="{
            'bg-[#292929] text-white font-semibold': isActive(item.routes),
          }"
        >
          {{ item.name }}
        </NuxtLink>
      </nav>

      <!-- Logout -->
      <div class="p-4 border-t">
        <button
          class="w-full cursor-pointer bg-red-500 text-white py-2 rounded hover:bg-red-600"
          @click="logout"
        >
          Logout
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 overflow-auto">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();

const menu = [
  { name: "My Projects", routes: ["/timer/projects", "/timer/projects/:id"] },
  {
    name: "Assigned Projects",
    routes: ["/timer/projects/assigned", "/timer/projects/assigned/:id"],
  },
];

const isActive = (routes: string[]) => {
  return routes.some((r) => {
    if (r.includes(":")) {
      const base = r.split("/:")[0];
      return route.path === (base as string);
    }
    return route.path === r;
  });
};

const { logout } = useAuthStore();
</script>
