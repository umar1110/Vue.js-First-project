import { prisma } from "~~/server/db";

export default defineEventHandler(async (event) => {
  
  // Get user id from query
  const query = getQuery(event);
  const userId = query.userId;
  if (!userId) {
    return createError({
      statusCode: 400,
      statusMessage: "User ID is required",
    });
  }

  const projects = await prisma.project.findMany({
    where: { createdBy: userId as string },
    include: {
      assignments: {
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      },
      creator: true,
    },
  });

  const projectsWithAssignments = projects.map((project) => ({
    ...project,
    assignedTo: project.assignments.map((a) => a.userId),
  }));

  return { statusCode: 200, projects: projectsWithAssignments };
});
