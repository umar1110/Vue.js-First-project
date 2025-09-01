import routes from "~/constants/routes";
import type { TaskInput } from "~/types/project.types";

export const getAllProjectTasks = async (projectId: string) => {
  try {
    const { $axios } = useNuxtApp();
    const response = await $axios.get(
      `${routes.api.project.tasks.all}?projectId=${projectId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching project tasks:", error);
    return error;
  }
};

export const addNewTaskAction = async (task: TaskInput) => {
  try {
    const { $axios } = useNuxtApp();
    const response = await $axios.post(
      `${routes.api.project.tasks.index}`,
      task
    );
    return response.data;
  } catch (error) {
    console.error("Error adding new task:", error);
    return error;
  }
};

export const updateTaskAction = async (taskId: string, task: TaskInput) => {
  try {
    const { $axios } = useNuxtApp();
    const response = await $axios.put(`${routes.api.project.tasks.index}`, {
      ...task,
      taskId,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    return error;
  }
};
