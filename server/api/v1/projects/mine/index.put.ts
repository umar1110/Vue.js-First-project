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

  const user = await serverSupabaseUser(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }
  const userId = user.id;

  let project = await projectService.getProjectById(body.projectId);
  if (!project) {
    throw createError({
      statusCode: 404,
      statusMessage: "Project not found",
    });
  }

  if (project.createdBy !== userId) {
    throw createError({
      statusCode: 403,
      statusMessage: "Not allowed",
    });
  }

  project = await projectService.updateProject(project.id, body);
  return {
    statusCode: 200,
    project,
  };
});
