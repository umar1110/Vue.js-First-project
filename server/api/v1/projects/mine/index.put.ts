import { projectService } from "~~/server/services/project.services";
import { serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const body: {
    projectId: string;
    name?: string;
    description?: string;
    createdBy?: string;
    estimatedHours?: number;
    assignedTo?: string[];
  } = await readBody(event);

  const userId = event.context.user.id;

  let project = await projectService.getProjectById(body.projectId);
  if (!project) {
    throw createError({
      statusCode: 404,
      statusMessage: "Project not found",
      message: "The specified project could not be found."
    });
  }

  if (project.createdBy !== userId) {
    throw createError({
      statusCode: 403,
      statusMessage: "Not allowed",
      message: "You are not allowed to modify this project."
    });
  }

  project = await projectService.updateProject(project.id, body);
  return {
    statusCode: 200,
    project,
  };
});
