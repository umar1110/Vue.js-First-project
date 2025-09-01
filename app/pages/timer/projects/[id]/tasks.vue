<script setup lang="ts">
import type { FormEvent, TableColumn } from "@nuxt/ui";
import type { TaskType } from "~/types/project.types";
import type { Row } from "@tanstack/vue-table";
import { addNewTaskAction, updateTaskAction } from "~/actions/taskActions";

const toast = useToast();
const route = useRoute();
const projectId = route.params.id;
const projectDetailsStore = useProjectDetailsStore();
const userStore = useUsersStore();
const { fetchUsers } = userStore;
const { fetchProjectTasks, addNewTask } = projectDetailsStore;
const { projectTasks, tasksLoading } = storeToRefs(projectDetailsStore);
const { users, loading: usersLoading } = storeToRefs(userStore);
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const assignees = ref<string[]>([]);
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
          row.original.assignees.map((assignee) => {
            const userStore = useUsersStore();
            const user = userStore.users.find((u) => u.id === assignee.userId);
            return h(UAvatar, {
              key: assignee.userId,
              image: "",

              name: user ? user.name : "Unknown",
              title: user ? user.email : "Unknown",
            });
          })
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return h(
        "div",
        { class: "text-right" },
        h(
          UDropdownMenu,
          {
            content: {
              align: "end",
            },
            items: getRowItems(row),
            "aria-label": "Actions dropdown",
          },
          () =>
            h(UButton, {
              icon: "i-lucide-ellipsis-vertical",
              color: "neutral",
              variant: "ghost",
              class: "ml-auto",
              "aria-label": "Actions dropdown",
            })
        )
      );
    },
  },
];
const booleans = reactive({
  isAddNewTaskModalOpen: false,
  isEditTaskModalOpen: false,
});
const newTask = reactive<TaskType>({
  title: "",
  description: "",
  estimatedHours: 0,
  projectId: projectId as string,
  assignees: [],
});
const selectedTask = ref<TaskType>({
  title: "",
  description: "",
  estimatedHours: 0,
  projectId: projectId as string,
  assignees: [],
});

function getRowItems(row: Row<TaskType>) {
  return [
    {
      label: "Edit Task",
      onSelect() {
        assignees.value = row.original.assignees.map((a) => a.userId);
        selectedTask.value = { ...row.original };
        booleans.isEditTaskModalOpen = true;
      },
    },

    {
      label: "Delete Task",
      onSelect() {
        // Implement delete task logic here
      },
    },
  ];
}

const handleAddNewTask = async () => {
  try {
    toast.add({
      color: "info",
      title: "Adding task...",
    });

    const response = await addNewTaskAction({
      ...newTask,
      assignees: assignees.value,
    });
    if (response.statusCode < 400) {
      booleans.isAddNewTaskModalOpen = false;
      fetchProjectTasks(projectId as string, true);
      toast.add({
        color: "success",
        title: "Task added successfully",
      });
    } else {
      toast.add({
        color: "error",
        title: "Failed to add task",
      });
    }
  } catch (error) {}
};
const handleEditTask = async () => {
  try {
    toast.add({
      color: "info",
      title: "Editing task...",
    });
    if (!selectedTask?.value.id) {
      return;
    }
    const response = await updateTaskAction(selectedTask.value.id, {
      ...selectedTask.value,
      assignees: assignees.value,
    });
    if (response.statusCode < 400) {
      toast.add({
        color: "success",
        title: "Task edited successfully",
      });
      booleans.isEditTaskModalOpen = false;
      fetchProjectTasks(projectId as string, true);
    } else {
      toast.add({
        color: "error",
        title: "Failed to edit task",
        duration: 3000,
      });
    }
  } catch (error) {}
};
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
            assignees = [];
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
                    v-model="assignees"
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
    <UModal
      title="Add new task"
      :close="{
        color: 'primary',
        variant: 'outline',
        class: 'rounded-full',
      }"
      v-model:open="booleans.isEditTaskModalOpen"
    >
      <template #content>
        <form
          @submit.prevent="handleEditTask"
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
                    v-model="selectedTask.title"
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
                    v-model="assignees"
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
                    v-model="selectedTask.estimatedHours"
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
                v-model="selectedTask.description"
                class="w-full"
              />
            </div>
            <button
              type="submit"
              class="ml-auto bg-white cursor-pointer rounded-md text-black py-2 px-4 hover:bg-gray-300"
            >
              Update Task
            </button>
          </div>
        </form>
      </template>
    </UModal>
  </NuxtLayout>
</template>
