<template>
  <BaseLayout>
    <div class="flex h-screen bg-[#050505]">
      <aside class="w-64 bg-[#3a0b50] shadow-lg flex flex-col">
        <div class="h-16 flex items-center justify-center border-b">
          <h1 class="text-xl font-bold">Dashboard</h1>
        </div>
        <nav class="flex-1 p-4 space-y-2">
          <NuxtLink
            v-for="item in menu"
            :key="item.name"
            :to="item.route"
            class="block px-4 py-2 rounded hover:bg-gray-200 hover:text-black"
            :class="{ 'bg-gray-200  text-black font-semibold': isActive(item.route) }"
          >
            {{ item.name }}
          </NuxtLink>
        </nav>

        <div class="p-4 border-t">
          <button
            class="w-full cursor-pointer bg-red-500 text-white py-2 rounded hover:bg-red-600"
            @click="logout"
          >
            Logout
          </button>
        </div>
      </aside>
      <main class="flex-1 overflow-auto">
        <slot />
      </main>
    </div>
  </BaseLayout>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import BaseLayout from "./BaseLayout.vue";

const route = useRoute();

const menu = [
  { name: "Users", route: "/timer/users" },
  { name: "Projects", route: "/timer/projects" }
];

const isActive = (r: string) => route.path === r;

const { logout } = useAuthStore();
</script>
