import { serverSupabaseUser } from "#supabase/server";
import { prisma } from "~~/server/db";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  // Find projects where the current user is assigned
  const assignedProjects = await prisma.projectAssignment.findMany({
    where: {
      userId: user.id,
    },
    include: {
      project: true, // include full project details
    },
  });

  return {
    status: 200,
    message: "Assigned projects fetched successfully",
    data: assignedProjects.map((a: any) => a.project),
  };
});
