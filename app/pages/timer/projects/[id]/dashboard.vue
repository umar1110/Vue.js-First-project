<template>
  <div>dashboard: {{ projectId }}</div>
</template>
<script setup lang="ts">
defineProps({
  projectId: {
    type: String,
    required: true,
  },
});
</script>
