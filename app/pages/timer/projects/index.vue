<template>
  <div>
    <header class="bg-[#141414] py-5 px-3 flex justify-end">
      <button
        @click="
          () => {
            booleans.isAddNewProjectSlideOverOpen = true;
            projectData.name = '';
            projectData.color = '';
            projectData.assignedTo = [];
            projectData.estimatedHours = 0;
            projectData.description = '';
            projectData.color = getRandomColor();
            timeFrameStart = new CalendarDate(
              new Date().getFullYear(),
              new Date().getMonth() + 1,
              new Date().getDate()
            );
            timeFrameEnd = null;
          }
        "
        class="bg-white cursor-pointer rounded-md text-black py-2 px-4 hover:bg-gray-300"
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
    <UModal
      title="Add new project"
      v-model:open="booleans.isAddNewProjectSlideOverOpen"
    >
      <template #content>
        <!-- Add New Project Form -->
        <form
          @submit.prevent="createProject"
          class="space-y-4 p-3 relative h-fit"
        >
          <div
            class="flex flex-col p-6 space-y-8 justify-start space-x-2 items-start"
          >
            <div class="flex w-full items-center space-x-3">
              <div class="flex flex-col translate-y-2 items-center">
                <div
                  @click="booleans.isAddColorPickerOpen = true"
                  :style="{ backgroundColor: projectData.color }"
                  class="w-10 h-10 rounded-full"
                />
                <span class="text-xs">Color</span>
              </div>
              <UModal
                title="Select Project Color"
                class="w-fit"
                v-model:open="booleans.isAddColorPickerOpen"
              >
                <template #content>
                  <div class="p-4">
                    <UColorPicker v-model="projectData.color" />
                  </div>
                  <!-- Show color in bar -->
                  <div
                    class="h-8 my-2 rounded-full"
                    :style="{ backgroundColor: projectData.color }"
                  />
                  <!-- Value of color -->
                  <div class="text-sm text-gray-400 text-center my-3">
                    {{ projectData.color }}
                  </div>
                </template>
              </UModal>
              <div class="flex-1">
                <span class="font-medium text-sm text-gray-300"
                  >Project Name</span
                >
                <div class="w-full">
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
            </div>
            <div class="flex flex-col w-full space-y-3">
              <div class="flex flex-col w-full">
                <span class="text-sm font-medium text-gray-400"
                  >Assign users</span
                >
                <div class="flex-1">
                  <USelect
                    v-model="projectData.assignedTo"
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
                    v-model="projectData.estimatedHours"
                    type="number"
                    placeholder="Estimated Hours"
                    class="w-full h-10"
                  />
                </div>
              </div>
            </div>
            <div class="flex space-x-8">
              <!-- Dates -->
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-400"
                  >Time frame start</span
                >
                <UPopover>
                  <UButton
                    color="neutral"
                    variant="subtle"
                    icon="i-lucide-calendar"
                  >
                    {{
                      timeFrameStart
                        ? dateFormatter.format(
                            timeFrameStart.toDate(getLocalTimeZone())
                          )
                        : "Select start date"
                    }}
                  </UButton>

                  <template #content>
                    <UCalendar
                      :min-value="
                        new CalendarDate(
                          new Date().getFullYear(),
                          new Date().getMonth() + 1,
                          new Date().getDate()
                        )
                      "
                      v-model="timeFrameStart"
                      class="p-2"
                    />
                  </template>
                </UPopover>
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-400"
                  >Time frame End (Optional)</span
                >
                <UPopover>
                  <UButton
                    color="neutral"
                    variant="subtle"
                    icon="i-lucide-calendar"
                  >
                    {{
                      timeFrameEnd
                        ? dateFormatter.format(
                            timeFrameEnd.toDate(getLocalTimeZone())
                          )
                        : "Select end date"
                    }}
                  </UButton>

                  <template #content>
                    <UCalendar
                      v-model="timeFrameEnd"
                      class="p-2"
                      :min-value="
                        new CalendarDate(
                          timeFrameStart.year,
                          timeFrameStart.month,
                          timeFrameStart.day
                        )
                      "
                    />
                  </template>
                </UPopover>
              </div>
            </div>
            <button
              type="submit"
              class="ml-auto bg-white cursor-pointer rounded-md text-black py-2 px-4 hover:bg-gray-300"
            >
              Create Project
            </button>
          </div>
        </form>
      </template>
    </UModal>
    <!-- Edit project form -->
    <UModal
      title="Edit project"
      :close="{
        color: 'primary',
        variant: 'outline',
        class: 'rounded-full',
      }"
      v-model:open="booleans.isEditProjectSlideOverOpen"
    >
      <template #content>
        <form
          v-if="selectedProject"
          @submit.prevent="updateProject"
          class="space-y-4 p-3 relative h-fit"
        >
          <div
            class="flex flex-col p-6 space-y-8 justify-start space-x-2 items-start"
          >
            <div class="flex w-full items-center space-x-3">
              <div class="flex flex-col translate-y-2 items-center">
                <div
                  @click="booleans.isAddColorPickerOpen = true"
                  :style="{ backgroundColor: selectedProject.color }"
                  class="w-10 h-10 rounded-full"
                />
                <span class="text-xs">Color</span>
              </div>
              <UModal
                title="Select Project Color"
                class="w-fit"
                v-model:open="booleans.isAddColorPickerOpen"
              >
                <template #content>
                  <div class="p-4">
                    <UColorPicker v-model="selectedProject.color" />
                  </div>
                  <!-- Show color in bar -->
                  <div
                    class="h-8 my-2 rounded-full"
                    :style="{ backgroundColor: selectedProject.color }"
                  />
                  <!-- Value of color -->
                  <div class="text-sm text-gray-400 text-center my-3">
                    {{ selectedProject.color }}
                  </div>
                </template>
              </UModal>
              <div class="flex-1">
                <span class="font-medium text-sm text-gray-300"
                  >Project Name</span
                >
                <div class="w-full">
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
            </div>
            <div class="flex flex-col w-full space-y-3">
              <div class="flex flex-col w-full">
                <span class="text-sm font-medium text-gray-400"
                  >Assign users</span
                >
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
              <div class="flex flex-col w-full space-x-2">
                <span class="text-sm font-medium text-gray-400"
                  >Estimated Hours</span
                >
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
            </div>
            <div class="flex space-x-8">
              <!-- Dates -->
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-400"
                  >Time frame start</span
                >
                <UPopover>
                  <UButton
                    color="neutral"
                    variant="subtle"
                    icon="i-lucide-calendar"
                  >
                    {{
                      timeFrameStart
                        ? dateFormatter.format(
                            timeFrameStart.toDate(getLocalTimeZone())
                          )
                        : "Select start date"
                    }}
                  </UButton>

                  <template #content>
                    <UCalendar v-model="timeFrameStart" class="p-2" />
                  </template>
                </UPopover>
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-400"
                  >Time frame End (Optional)</span
                >
                <UPopover>
                  <UButton
                    color="neutral"
                    variant="subtle"
                    icon="i-lucide-calendar"
                  >
                    {{
                      timeFrameEnd
                        ? dateFormatter.format(
                            timeFrameEnd.toDate(getLocalTimeZone())
                          )
                        : "Select end date"
                    }}
                  </UButton>

                  <template #content>
                    <UCalendar
                      v-model="timeFrameEnd"
                      class="p-2"
                      :min-value="
                        new CalendarDate(
                          timeFrameStart.year,
                          timeFrameStart.month,
                          timeFrameStart.day
                        )
                      "
                    />
                  </template>
                </UPopover>
              </div>
            </div>
            <button
              type="submit"
              class="ml-auto bg-white cursor-pointer rounded-md text-black py-2 px-4 hover:bg-gray-300"
            >
              Create Project
            </button>
          </div>
        </form>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
} from "@internationalized/date";
import type { TableColumn } from "@nuxt/ui";
import type { Row } from "@tanstack/vue-table";
import { h, resolveComponent } from "vue";
import {
  createMyProjectAction,
  deleteMyProjectAction,
  updateMyProjectAction,
} from "~/actions/projectActions";
import type { ProjectType } from "~/types/project.types";

const dateFormatter = new DateFormatter("en-US", {
  dateStyle: "medium",
});

const timeFrameStart = shallowRef(
  new CalendarDate(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    new Date().getDate()
  )
);

const timeFrameEnd = shallowRef();
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
    cell: ({ row }) => {
      const NuxtLink = resolveComponent("NuxtLink"); // resolve NuxtLink component

      return h(
        NuxtLink,
        {
          class: "flex items-center space-x-2",
          to: `/timer/projects/${row.original.id}`,
        },
        [
          h("div", {
            class: "w-4 h-4 rounded-full",
            style: { backgroundColor: row.original.color },
          }),
          h(
            "span",
            {
              class: "font-medium",
              style: { color: row.original.color },
            },
            row.original.name
          ),
        ]
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "timeFrameStart",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "Time Frame",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
    cell: ({ row }) => {
      const date = new Date(row.original.timeFrameStart);
      if (row.original.timeFrameEnd) {
        const endDate = new Date(row.original.timeFrameEnd);
        return `${dateFormatter.format(date)} - ${dateFormatter.format(
          endDate
        )}`;
      }
      return dateFormatter.format(date);
    },
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
      return timeStatus ? `${timeStatus} h` : "oh";
    },
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
  isAddColorPickerOpen: false,
});
const projectData: ProjectType = reactive({
  id: "",
  name: "",
  description: "",
  estimatedHours: 0,
  timeStatus: 0,
  createdBy: authStore.user.id || "",
  assignedTo: [],
  color: getRandomColor(),
  timeFrameStart: new Date(),
  status: "OPEN",
});
const selectedProject = ref<ProjectType | null>(null);

// Methods
function getRowItems(row: Row<ProjectType>) {
  return [
    {
      label: "Edit Project",
      onSelect() {
        selectedProject.value = { ...row.original };
        const timeFrameStartDate = new Date(row.original.timeFrameStart);
        timeFrameStart.value = new CalendarDate(
          timeFrameStartDate.getFullYear(),
          timeFrameStartDate.getMonth() + 1,
          timeFrameStartDate.getDate()
        );
        if (row.original.timeFrameEnd) {
          const timeFrameEndDate = new Date(row.original.timeFrameEnd);
          timeFrameEnd.value = new CalendarDate(
            timeFrameEndDate.getFullYear(),
            timeFrameEndDate.getMonth() + 1,
            timeFrameEndDate.getDate()
          );
        }
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
    projectData.timeFrameStart = timeFrameStart.value.toDate(
      getLocalTimeZone()
    );
    projectData.timeFrameEnd =
      timeFrameEnd.value?.toDate(getLocalTimeZone()) || null;
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
    selectedProject.value.timeFrameStart = timeFrameStart.value.toDate(
      getLocalTimeZone()
    );
    selectedProject.value.timeFrameEnd = timeFrameEnd.value?.toDate(
      getLocalTimeZone()
    );
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
