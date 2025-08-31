import { getProjectById } from "~/actions/projectActions";
import type { ProjectType, TaskType } from "~/types/project.types";
import { defineStore } from "pinia";

export const useProjectDetailsStore = defineStore("projectDetails", () => {
  const projectId = ref<string | null>(null);
  const projectDetails = ref<ProjectType | null>(null);
  const projectTasks = ref<TaskType[] | null>(null);
  const errorMessage = ref<string | null>(null);
  const loading = ref<boolean>(true);
  const fetchProjectDetails = async (id: string) => {
    if (id == projectId.value && projectDetails.value) return;
    loading.value = true;
    projectId.value = id;
    try {
      const response = await getProjectById(id);
      if (response.statusCode == 200) {
        projectDetails.value = response.project;
      } else {
        errorMessage.value = response.message;
      }
    } catch (error) {
      projectDetails.value = null;
      projectId.value = null;
      errorMessage.value = "An error occurred while fetching project details.";
    } finally {
      loading.value = false;
    }
  };
  const clearError = () => {
    errorMessage.value = null;
  };
  const resetDetails = () => {
    projectId.value = null;
    projectDetails.value = null;
    errorMessage.value = null;
  };
  return {
    projectId,
    projectDetails,
    errorMessage,
    fetchProjectDetails,
    clearError,
    loading,
    resetDetails,
  };
});
