<template>
  <div>
    <header
      class="bg-[#3a0b50] border-l border-white py-3 px-3 flex justify-end"
    >
      <button
        @click="
          () => {
            open = true;
          }
        "
        class="bg-blue-500 cursor-pointer rounded-full text-white py-2 px-4 hover:bg-blue-600"
      >
        + New Project
      </button>
    </header>

    <div>
      <USlideover
        title="Add new project"
        :close="{
          color: 'primary',
          variant: 'outline',
          class: 'rounded-full',
        }"
        v-model:open="open"
      >
        <template #content>
          <div class="space-y-4 p-3">
            <!-- Name -->
            <div class="flex space-x-2 items-center">
              <span>Project Name</span>
              <div class="flex-1">
                <UInput
                  size="xl"
                  v-model="projectData.name"
                  type="text"
                  placeholder="Project Name"
                  class="w-full h-10"
                />
              </div>
            </div>
            <div class="flex space-x-2 items-center">
              <span>Assign users</span>
              <div class="flex-1">
                <USelect
                  v-model="projectData.assingnedTo"
                  :items="users"
                  placeholder="Select user"
                  value-key="id"
                  multiple
                  :ui="{ content: 'min-w-fit' }"
                  class="w-full"
                >
                  <template #item-label="{ item }">
                    {{ item.name }}
                  </template>
                </USelect>
              </div>
            </div>
            <div class="flex min-h-fit space-x-2 items-center">
              <span>Project Description</span>
              <div class="flex-1">
                <UTextarea
                  size="xl"
                  v-model="projectData.description"
                  placeholder="Project Description"
                  class="w-full h-10"
                />
              </div>
            </div>
          </div>
        </template>
      </USlideover>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProjectType } from "~/types/project.types";
const open = ref(false);
const projectData: ProjectType = reactive({
  id: "",
  name: "",
  description: "",
  estimatedHours: 0,
  createdBy: "",
  assingnedTo: [],
});

const userStore = usersStore();
const { fetchUsers } = userStore;
const { users, loading: usersLoading } = storeToRefs(userStore);
onMounted(async () => {
  await fetchUsers();
});

definePageMeta({
  layout: "dashboard",
});
</script>
