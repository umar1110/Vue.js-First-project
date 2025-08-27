// DElete project Route

import { projectService } from "~~/server/services/project.services";

export default defineEventHandler(async (event) => {
  const projectId = getRouterParam(event, "id");
  if (!projectId) {
    return createError({
      statusCode: 400,
      statusMessage: "Project ID is required",
    });
  }

  await projectService.deleteProject(projectId);

  return { statusCode: 200, statusMessage: "Project deleted successfully" };
});
