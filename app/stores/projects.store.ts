import { getAllMyProjects } from "~/actions/projectActions";
import type { ProjectType } from "~/types/project.types";

export const useProjectsStore = defineStore("projects", () => {
  const projects = ref<ProjectType[]>([]);
  const errorMessage = ref<string>("");
  const loading = ref<boolean>(true);

  async function fetchProjects() {
    loading.value = true;
    try {
      const response = await getAllMyProjects();
      if (response.statusCode == 200) {
        projects.value = response.projects;
      } else {
        errorMessage.value = response.message || "Failed to fetch projects";
      }
    } catch (error) {
      errorMessage.value = "Failed to fetch projects";
    } finally {
      loading.value = false;
    }
  }

  return {
    projects,
    errorMessage,
    loading,
    fetchProjects,
  };
});
