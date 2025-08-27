<template>
  <div>
    <NuxtLayout>
      <UApp>
        <NuxtPage />
      </UApp>
    </NuxtLayout>
  </div>
</template>

<!-- For test purpose onluy -->
<!-- 
<script setup lang="ts">
  const {$axios} = useNuxtApp()
  const fetchUser = async ()=>{
    const response = await $axios.get('/api/test')
    console.log("response from app.vue =================> ", response.data)
  }
  onMounted(() => {
    fetchUser()
  });

</script> -->
