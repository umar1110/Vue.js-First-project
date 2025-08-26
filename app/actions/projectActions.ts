import routes from "~/constants/routes";
import type { ProjectType } from "~/types/project.types";

const createProjectAction = async (project: ProjectType) => {
  try {
    const { $axios } = useNuxtApp();
    const response = await $axios.post(routes.api.project.create, {
      ...project,
    });
    return response.data
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};
