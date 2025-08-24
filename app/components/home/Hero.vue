<template>
  <section
    :style="{ backgroundColor: theme.colors.primary }"
    class="min-h-[70vh] space-y-6 flex items-center justify-center flex-col"
  >
    <div class="text-8xl text-center leading-[1.2]  ">
      <h1>
        Where
        <span
          :style="{
            color: theme.colors.secondary,
          }"
          class="italic font-semibold inline-block transform -skew-x-12"
          >teams</span
        >
        and time
      </h1>
      <p>
        tracking
        <span
          :style="{
            color: theme.colors.secondary,
          }"
          class="italic font-semibold inline-block transform -skew-x-12"
          >data</span
        >
        meet
      </p>
    </div>

    <div class="text-center text-2xl font-semibold font-mono ">
      <p>
        The only time tracking software that builds custom reports from your
        team's
      </p>
      <p>time data to maximize productivity and revenue.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { theme } from "@/constants/theme";
</script>
