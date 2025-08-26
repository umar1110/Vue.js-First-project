import { prisma } from "~~/server/db";

export default defineEventHandler(async (event) => {
  const projects = await prisma.project.findMany();
  return { status: 200, projects };
});
