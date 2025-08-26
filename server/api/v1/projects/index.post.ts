import { prisma } from "~~/server/db";

export default defineEventHandler(async (event) => {
  const body: {
    name: string;
    description: string;
    creatorId: string;
    estimatedHours: number;
    assignedTo: string[];
  } = await readBody(event);

  if (!body) {
    throw createError({ statusCode: 400, message: "Missing project data" });
  }

  try {
    const project = await prisma.project.create({
      data: {
        name: body.name,
        description: body.description || null,
        creator: {
          connect: { id: body.creatorId },
        },
        estimatedHours: body.estimatedHours || 0,
        assignments: {
          create: body.assignedTo.map((userId) => ({
            user: { connect: { id: userId } },
          })),
        },
      },
      include: {
        creator: true,
        assignments: {
          include: {
            user: true,
          },
        },
      },
    });

    return { status: 201, project };
  } catch (err: any) {
    // Prisma errors have a `code` and `message`
    console.error("Prisma error:", err);

    throw createError({
      statusCode: 500,
      message: err?.message || "Database error",
    });
  }
});
