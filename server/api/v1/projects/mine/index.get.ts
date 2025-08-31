import { prisma } from "~~/server/db";
import { projectService } from "~~/server/services/project.services";

export default defineEventHandler(async (event) => {
  // Get user id from context
  const userId = event.context.user.id;

  if (!userId) {
    return createError({
      statusCode: 400,
      statusMessage: "User ID is required",
      message: "User ID is required",
    });
  }

  const pinnedProjects = await projectService.getPinnedProjectsByUserId(
    userId as string
  );
  const unpinnedProjects = await projectService.getUnpinnedProjectsByUserId(
    userId as string
  );

  const pinnedWithAssignments = pinnedProjects.map((project) => ({
    ...project,
    assignedTo: project.assignments.map((a) => a.userId),
  }));

  const unpinnedWithAssignments = unpinnedProjects.map((project) => ({
    ...project,
    assignedTo: project.assignments.map((a) => a.userId),
  }));

  return {
    statusCode: 200,
    projects: [...pinnedWithAssignments, ...unpinnedWithAssignments],
  };
});
