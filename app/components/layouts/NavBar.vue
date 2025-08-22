<template>
  <header class="bg-slate-800 text-white p-4">
    <nav class="flex justify-between items-center">
      <h1 class="text-xl font-bold">TimeLogger</h1>
      <ul class="flex gap-4">
        <li><NuxtLink to="/">Home</NuxtLink></li>
        <li><NuxtLink to="/about">About</NuxtLink></li>
        <li><NuxtLink to="/dashboard">Dashboard</NuxtLink></li>
      </ul>
      <div v-if="isAuthenticated">
        <button class="cursor-pointer" @click="auth.logout">Logout</button>
      </div>
      <div v-if="!isAuthenticated">
        <NuxtLink to="/auth/login">Login</NuxtLink>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
const auth = useAuthStore();
const { isAuthenticated } = storeToRefs(auth);
</script>
