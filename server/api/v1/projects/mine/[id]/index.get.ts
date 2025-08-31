import { projectService } from "~~/server/services/project.services";

export default defineEventHandler(async (event) => {
  const projectId = getRouterParam(event, "id");

  const project = await projectService.getProjectById(projectId!);
  const userId = event.context.user.id;
  if (!project) {
    return createError({
      statusCode: 400,
      statusMessage: "Invalid project ID",
      message: "Project Not found",
    });
  }
  
  if (userId != project?.createdBy) {
    return createError({
      statusCode: 403,
      statusMessage: "Forbidden",
      message: "You are not allowed to access this project",
    });
}
  return {
    statusCode: 200,
    project,
  };
});
