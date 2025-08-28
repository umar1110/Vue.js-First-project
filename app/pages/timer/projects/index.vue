<template>
  <div>
    <header
      class="bg-[#141414] border-l border-white py-5 px-3 flex justify-end"
    >
      <button
        @click="
          () => {
            booleans.isAddNewProjectSlideOverOpen = true;
          }
        "
        class="bg-blue-500 cursor-pointer rounded-full text-white py-2 px-4 hover:bg-blue-600"
      >
        + New Project
      </button>
    </header>
    <!-- Table for projects  -->
    <div v-if="projectsLoading" class="p-6 space-y-6">
      <USkeleton v-for="n in 5" :key="n" class="h-10 w-full" />
    </div>
    <div v-if="!projectsLoading">
      <UTable :data="projects" :columns="columns" class="flex-1" />
    </div>

    <!-- Slide over for add new project -->
    <USlideover
      title="Add new project"
      :close="{
        color: 'primary',
        variant: 'outline',
        class: 'rounded-full',
      }"
      v-model:open="booleans.isAddNewProjectSlideOverOpen"
    >
      <template #content>
        <form
          @submit.prevent="createProject"
          class="space-y-4 p-3 relative h-full"
        >
          <!-- Name -->
          <div class="flex space-x-2 items-center">
            <span>Project Name</span>
            <div class="flex-1">
              <UInput
                :required="true"
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
                v-model="projectData.assignedTo"
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
            <span>Estimated Hours</span>
            <div class="flex-1">
              <UInput
                required
                size="xl"
                v-model="projectData.estimatedHours"
                type="number"
                placeholder="Estimated Hours"
                class="w-full h-10"
              />
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
          <button
            type="submit"
            class="absolute right-3 bottom-3 bg-blue-500 cursor-pointer rounded-full text-white py-2 px-4 hover:bg-blue-600"
          >
            Create Project
          </button>
        </form>
      </template>
    </USlideover>
    <!-- Slide over for Edit project -->
    <USlideover
      v-if="selectedProject"
      :title="`Edit Project - ${selectedProject.name || ''}`"
      :close="{
        color: 'primary',
        variant: 'outline',
        class: 'rounded-full',
      }"
      v-model:open="booleans.isEditProjectSlideOverOpen"
    >
      <template #content>
        <form
          @submit.prevent="updateProject"
          class="space-y-4 p-3 relative h-full"
        >
          <!-- Name -->
          <div class="flex space-x-2 items-center">
            <span>Project Name</span>
            <div class="flex-1">
              <UInput
                :required="true"
                size="xl"
                v-model="selectedProject.name"
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
                v-model="selectedProject.assignedTo"
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
            <span>Estimated Hours</span>
            <div class="flex-1">
              <UInput
                required
                size="xl"
                v-model="selectedProject.estimatedHours"
                type="number"
                placeholder="Estimated Hours"
                class="w-full h-10"
              />
            </div>
          </div>
          <div class="flex min-h-fit space-x-2 items-center">
            <span>Project Description</span>
            <div class="flex-1">
              <UTextarea
                size="xl"
                v-model="selectedProject.description"
                placeholder="Project Description"
                class="w-full h-10"
              />
            </div>
          </div>
          <button
            type="submit"
            class="absolute right-3 bottom-3 bg-blue-500 cursor-pointer rounded-full text-white py-2 px-4 hover:bg-blue-600"
          >
            Update Project
          </button>
        </form>
      </template>
    </USlideover>
  </div>
</template>

<script setup lang="ts">

import type { TableColumn } from "@nuxt/ui";
import type { Row } from "@tanstack/vue-table";
import { h, resolveComponent } from "vue";
import {
  createMyProjectAction,
  deleteMyProjectAction,
  updateMyProjectAction,
} from "~/actions/projectActions";
import type { ProjectType } from "~/types/project.types";
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");

// Constants
const columns: TableColumn<ProjectType>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "creator.email",
    header: "Email",
  },
  // For actions like delete and edit
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

// Stores
const authStore = useAuthStore();
const userStore = useUsersStore();
const projectStore = useProjectsStore();

// Extractions from store
const { fetchUsers } = userStore;
const { fetchProjects } = projectStore;
const { users, loading: usersLoading } = storeToRefs(userStore);
const {
  projects,
  loading: projectsLoading,
  errorMessage,
} = storeToRefs(projectStore);

// States
const toast = useToast();
const booleans = reactive({
  isAddNewProjectSlideOverOpen: false,
  isEditProjectSlideOverOpen: false,
});
const projectData: ProjectType = reactive({
  id: "",
  name: "",
  description: "",
  estimatedHours: 0,
  createdBy: authStore.user.id || "",
  assignedTo: [],
});
const selectedProject = ref<ProjectType | null>(null);

// Methods
function getRowItems(row: Row<ProjectType>) {
  return [
    {
      label: "Edit Project",
      onSelect() {
        selectedProject.value = { ...row.original };
        booleans.isEditProjectSlideOverOpen = true;
      },
    },
    {
      label: "Delete Project",
      onSelect() {
        deleteProject(row.original.id!);
      },
    },
  ];
}
const createProject = async () => {
  try {
    toast.add({
      color: "info",
      title: "Creating project...",
    });
    const response = await createMyProjectAction(projectData);
    if (response.statusCode === 201) {
      booleans.isAddNewProjectSlideOverOpen = false;
      projectData.name = "";
      projectData.description = "";
      projectData.estimatedHours = 0;
      projectData.assignedTo = [];
      toast.clear();
      toast.add({
        color: "success",
        title: "Project created successfully!",
      });
      await fetchProjects();
    } else {
      toast.add({
        color: "error",
        title: response.message || "Failed to create project",
      });
    }
  } catch (error) {}
};

const updateProject = async () => {
  try {
    toast.add({
      color: "info",
      title: "Updating project...",
    });
    if (!selectedProject.value) return;
    const response = await updateMyProjectAction(
      selectedProject.value.id!,
      selectedProject.value
    );
    if (response.statusCode === 200) {
      booleans.isEditProjectSlideOverOpen = false;
      toast.clear();
      toast.add({
        color: "success",
        title: "Project updated successfully!",
      });
      await fetchProjects();
    } else {
      toast.add({
        color: "error",
        title: response.message || "Failed to update project",
      });
    }
  } catch (error) {}
};

const deleteProject = async (id: string) => {
  try {
    toast.add({
      color: "info",
      title: "Deleting project...",
    });
    const response = await deleteMyProjectAction(id);
    if (response.statusCode === 200) {
      toast.clear();
      toast.add({
        color: "success",
        title: "Project deleted successfully!",
      });
      await fetchProjects();
    } else {
      toast.add({
        color: "error",
        title: response.message || "Failed to delete project",
      });
    }
  } catch (error) {
    console.error("Error deleting project:", error);
  }
};

onMounted(() => {
  fetchProjects();
  fetchUsers();
});
</script>
