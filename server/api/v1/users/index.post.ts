import { prisma } from "~~/server/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.id || !body.email) {
    throw createError({ statusCode: 400, message: "Missing user data" });
  }

  const user = await prisma.user.upsert({
    where: { id: body.id },
    update: {
      email: body.email,
      name: body.name || null,
      role: body.role || "USER",
    },
    create: {
      id: body.id,
      email: body.email,
      role: body.role || "USER",
      name: body.name || null,
    },
  });

  return { status: 200, user };
});
