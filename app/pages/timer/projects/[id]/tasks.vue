<script setup lang="ts">
import type { FormEvent, TableColumn } from "@nuxt/ui";
import { addNewTaskAction } from "~/actions/projectActions";
import type { TaskType } from "~/types/project.types";

const toast = useToast();
const route = useRoute();
const projectId = route.params.id;
const projectDetailsStore = useProjectDetailsStore();
const userStore = useUsersStore();
const { fetchUsers } = userStore;
const { fetchProjectTasks, addNewTask } = projectDetailsStore;
const { projectTasks, tasksLoading } = storeToRefs(projectDetailsStore);
const { users, loading: usersLoading } = storeToRefs(userStore);
const columns: TableColumn<TaskType>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "title",
    header: "Task Name",
  },
  {
    accessorKey: "status",
    header: "Status",
  },

  {
    header: "Estimated time ",
    cell: ({ row }) => {
      const estimatedTime = row.original.estimatedHours;
      return estimatedTime ? `${estimatedTime} h` : "N/A";
    },
  },
  {
    header: "Time Status",
    cell: ({ row }) => {
      const timeStatus = row.original.timeStatus;
      return timeStatus ? `${timeStatus} h` : "0 h";
    },
  },
  {
    header: "Assigned to",
    cell: ({ row }) => {
      const UAvatarGroup = resolveComponent("UAvatarGroup");
      const UAvatar = resolveComponent("UAvatar");
      return h(
        UAvatarGroup,
        { max: 3, size: "sm" },
        () =>
          row.original.assignees &&
          row.original.assignees.map((userId) => {
            const userStore = useUsersStore();
            const user = userStore.users.find((u) => u.id === userId);
            return h(UAvatar, {
              key: userId,
              image: "",

              name: user ? user.name : "Unknown",
              title: user ? user.email : "Unknown",
            });
          })
      );
    },
  },
];

const booleans = reactive({
  isAddNewTaskModalOpen: false,
});
const newTask = reactive<TaskType>({
  title: "",
  description: "",
  estimatedHours: 0,
  projectId: projectId as string,
  assignees: [],
});
const handleAddNewTask = async () => {
  try {
    console.log({ ...newTask });
    toast.add({
      color: "info",
      title: "Adding task...",
      duration: 1000,
    });
    addNewTask(newTask);
    toast.add({
      color: "success",
      title: "Task added successfully",
      duration: 3000,
    });
    const response = await addNewTaskAction(newTask);
    if (response.statusCode < 400) {
      booleans.isAddNewTaskModalOpen = false;
      fetchProjectTasks(projectId as string);
    } else {
      toast.add({
        color: "error",
        title: "Failed to add task",
        duration: 3000,
      });
      fetchProjectTasks(projectId as string);
    }
  } catch (error) {}
};
// Watch for changes to the project ID and fetch tasks accordingly
watch(
  () => projectId,
  (newId) => {
    if (newId) {
      fetchProjectTasks(newId as string);
      fetchUsers();
    }
  },
  { immediate: true }
);
</script>

<template>
  <NuxtLayout name="project-details">
    <header class="flex justify-end">
      <UButton
        @click="
          {
            booleans.isAddNewTaskModalOpen = true;
          }
        "
        class="bg-white active:bg-white hover:bg-gray-300 cursor-pointer"
        >+ Add Task</UButton
      >
    </header>
    <div v-if="tasksLoading">Loading tasks...</div>
    <div v-else-if="projectTasks && projectTasks.length">
      <UTable :data="projectTasks" :columns="columns" class="flex-1" />
    </div>

    <div v-else class="h-90 w-full flex items-center justify-center text-xl">
      No tasks found.
    </div>

    <UModal
      title="Add new task"
      :close="{
        color: 'primary',
        variant: 'outline',
        class: 'rounded-full',
      }"
      v-model:open="booleans.isAddNewTaskModalOpen"
    >
      <template #content>
        <form
          @submit.prevent="handleAddNewTask"
          class="space-y-4 p-3 relative h-fit"
        >
          <div
            class="flex flex-col p-6 space-y-8 justify-start space-x-2 items-start"
          >
            <div class="flex w-full items-center space-x-3">
              <div class="flex-1">
                <span class="font-medium text-sm text-gray-300">Task Name</span>
                <div class="w-full">
                  <UInput
                    :required="true"
                    size="xl"
                    v-model="newTask.title"
                    type="text"
                    placeholder="Task Name"
                    class="w-full h-10"
                  />
                </div>
              </div>
            </div>
            <div class="flex flex-col w-full space-y-3">
              <div class="flex flex-col w-full">
                <span class="text-sm font-medium text-gray-400"
                  >Assign users</span
                >
                <div class="flex-1">
                  <USelect
                    v-model="newTask.assignees"
                    :items="users"
                    placeholder="Select user"
                    value-key="id"
                    label-key="name"
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
              <div class="flex flex-col w-full space-x-2">
                <span class="text-sm font-medium text-gray-400"
                  >Estimated Hours</span
                >
                <div class="flex-1">
                  <UInput
                    required
                    size="xl"
                    v-model="newTask.estimatedHours"
                    type="number"
                    placeholder="Estimated Hours"
                    class="w-full h-10"
                  />
                </div>
              </div>
            </div>

            <div class="w-full">
              <UTextarea
                placeholder="Task Description....(optional)"
                v-model="newTask.description"
                class="w-full"
              />
            </div>
            <button
              type="submit"
              class="ml-auto bg-white cursor-pointer rounded-md text-black py-2 px-4 hover:bg-gray-300"
            >
              Add Task
            </button>
          </div>
        </form>
      </template>
    </UModal>
  </NuxtLayout>
</template>
