import { defineStore } from "pinia";
import { getAllProjectTasks, getProjectById } from "~/actions/projectActions";
import type { ProjectType, TaskType } from "~/types/project.types";

export const useProjectDetailsStore = defineStore("projectDetails", () => {
  const projectId = ref<string | null>(null);
  const projectDetails = ref<ProjectType | null>(null);
  const projectTasks = ref<TaskType[] | null>(null);
  const tasksFor = ref<string | null>(null);
  const errorMessage = ref<string | null>(null);
  const loading = ref<boolean>(true);
  const tasksLoading = ref<boolean>(false);
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
  const fetchProjectTasks = async (id: string) => {
    if (projectTasks.value && tasksFor.value === id) return;
    tasksLoading.value = true;
    projectId.value = id;
    tasksFor.value = id;
    try {
      const response = await getAllProjectTasks(id);
      if (response.statusCode == 200) {
        projectTasks.value = response.tasks;
      } else {
        errorMessage.value = response.message;
        tasksFor.value = null;
        projectTasks.value = null;
      }
    } catch (error) {
      projectTasks.value = null;
      projectId.value = null;
      errorMessage.value = "An error occurred while fetching project tasks.";
    } finally {
      tasksLoading.value = false;
    }
  };
  const clearError = () => {
    errorMessage.value = null;
    resetDetails();
  };
  const resetDetails = () => {
    projectId.value = null;
    projectDetails.value = null;
    errorMessage.value = null;
    loading.value = true;
    tasksLoading.value = true;
    projectTasks.value = null;
  };
  const addNewTask = (task: TaskType) => {
    projectTasks.value = [task, ...(projectTasks.value || [])];
  };
  return {
    projectId,
    projectDetails,
    errorMessage,
    projectTasks,
    loading,
    tasksLoading,
    addNewTask,
    clearError,
    resetDetails,
    fetchProjectDetails,
    fetchProjectTasks,
  };
});
