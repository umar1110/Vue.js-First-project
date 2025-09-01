import routes from "~/constants/routes";
import type { ProjectType, TaskType } from "~/types/project.types";

export const createMyProjectAction = async (project: ProjectType) => {
  try {
    const { $axios } = useNuxtApp();
    const response = await $axios.post(routes.api.project.mine.index, {
      ...project,
    });
    console.log("response.data", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating project:", error);
    return error;
  }
};

export const getAllMyProjects = async () => {
  try {
    const { $axios } = useNuxtApp();
    const { user } = useAuthStore();
    const response = await $axios.get(
      `${routes.api.project.mine.index}?userId=${user.id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return error;
  }
};

export const updateMyProjectAction = async (
  projectId: string,
  updatedData: Partial<ProjectType>
) => {
  try {
    const { $axios } = useNuxtApp();
    const response = await $axios.put(`${routes.api.project.mine.index}`, {
      ...updatedData,
      projectId,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating project:", error);
    return error;
  }
};

export const deleteMyProjectAction = async (projectId: string) => {
  try {
    const { $axios } = useNuxtApp();
    const response = await $axios.delete(
      `${routes.api.project.mine.index}/${projectId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting project:", error);
    return error;
  }
};

export const getAssignedProjects = async () => {
  try {
    const { $axios } = useNuxtApp();
    const response = await $axios.get(`${routes.api.project.assigned.index}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching assigned projects:", error);
    return error;
  }
};

export const getProjectById = async (projectId: string) => {
  try {
    const { $axios } = useNuxtApp();
    const response = await $axios.get(
      `${routes.api.project.mine.index}/${projectId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching project:", error);
    return error;
  }
};

export const updatePinProject = async (pin: boolean, projectId: string) => {
  try {
    const { $axios } = useNuxtApp();
    const response = await $axios.put(
      `${routes.api.project.index}/pin`,
      {},
      {
        params: {
          projectId,
          pinned: pin,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating project pin status:", error);
    return error;
  }
};

export const getAssignedProjectsWithTasksAction = async () => {
  try {
    const { $axios } = useNuxtApp();
    const response = await $axios.get(
      `${routes.api.project.assigned.withTasks}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching assigned projects with tasks:", error);
    return error;
  }
};
