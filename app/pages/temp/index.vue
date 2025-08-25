<template>
  <div class="text-black">
    <div>
    {{ data.name }}
  </div>

  <button @click="changeName">
    Change Name
  </button>
  </div>
</template>

<script setup lang="ts">
// Reactive
const data = ref({
  name: "umar",
});

function changeName() {
  data.value.name = "new name";
}
console.log(data.value.name);
</script>
