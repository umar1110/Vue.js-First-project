<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navbar -->
    <NavBar />
    <!-- Main Page Content -->
    <main class="flex-1 ">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-slate-900 text-gray-300 text-center py-4">
      © 2025 My App
    </footer>
  </div>
</template>

<script setup lang="ts">
import NavBar from "~/components/layouts/NavBar.vue";
</script>
