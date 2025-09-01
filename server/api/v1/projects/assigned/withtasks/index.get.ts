import { projectService } from "~~/server/services/project.services";

export default defineEventHandler(async (event) => {
  const userId = event.context.user.id;
  const projects = await projectService.getAssignedProjectsWithTasks(userId);
  return {
    statusCode: 200,
    projects,
  };
});
