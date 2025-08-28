<template>
  <div class="min-h-screen flex flex-col">
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
import { theme } from "~/constants/theme";
</script>
