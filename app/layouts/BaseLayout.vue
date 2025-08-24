<template>
  <div class="min-h-screen flex flex-col">
    <NavBar />
    <main
      :style="{
        backgroundColor: theme.colors.background,
      }"
      class="flex-1"
    >
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import NavBar from "~/components/common/NavBar.vue";
import { theme } from "~/constants/theme";
</script>
