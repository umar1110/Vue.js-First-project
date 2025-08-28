<template>
  <div>
    <header
      class="bg-[#141414] border-l border-white py-3 px-3 flex justify-end"
    >
      <!-- <button
        class="bg-blue-500 cursor-pointer rounded-full text-white py-2 px-4 hover:bg-blue-600"
      ></button> -->
    </header>
    <!-- Table for projects  -->
    <div v-if="projectsLoading" class="p-6 space-y-6">
      <USkeleton v-for="n in 5" :key="n" class="h-10 w-full" />
    </div>
    <div v-if="!projectsLoading">
      <UTable :data="projects" :columns="columns" class="flex-1" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Row } from "@tanstack/vue-table";
import type { TableColumn } from "@nuxt/ui";
import type { ProjectType } from "~/types/project.types";
import routes from "~/constants/routes";
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

const assignedProjectsStore = useAssignedProjectsStore();
const { fetchProjects } = assignedProjectsStore;
const { projects, loading: projectsLoading } = storeToRefs(
  assignedProjectsStore
);

// Methods
function getRowItems(row: Row<ProjectType>) {
  return [
    {
      label: "Open",
      onSelect() {
        if (!row.original.id) {
          return;
        }
        navigateTo(routes.client.project.assigned.indexSingle(row.original.id));
      },
    },
  ];
}

onMounted(() => {
  fetchProjects();
});
</script>
