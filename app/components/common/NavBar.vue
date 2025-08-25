<template>
  <header
    :style="{
      backgroundColor: theme.colors.primary,
      color: theme.colors.primaryText,
    }"
    class="p-4"
  >
    <nav class="flex justify-between items-center">
      <NuxtLink
        to="/"
        class="text-3xl italic font-bold"
        :style="{ color: theme.colors.secondary }"
      >
        TimeLogger
      </NuxtLink>

      <div class="flex space-x-3 items-center">
        <ul class="flex gap-4">
          <li><NuxtLink to="#">Home</NuxtLink></li>
          <li><NuxtLink to="#">About</NuxtLink></li>
          <li><NuxtLink to="/timer">Dashboard</NuxtLink></li>
        </ul>
        <div v-if="!isAuthenticated" class="flex border-l-2 border-gray-300 px-3 space-x-3 items-center">
          
          <NuxtLink to="/auth/login">Login</NuxtLink>
          <NuxtLink
            to="/auth/signup"
            class="px-4 py-2 rounded-full text-center bg-[#FCE5D8] text-[#E57DD8]"
            >Register</NuxtLink
          >
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { theme } from "~/constants/theme";

const auth = useAuthStore();
const { isAuthenticated } = storeToRefs(auth);
</script>
