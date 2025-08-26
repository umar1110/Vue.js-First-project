// Get all users route

import { prisma } from "~~/server/db";

export default defineEventHandler(async (event) => {
  const users = await prisma.user.findMany();
  return {
    status: 200,
    users,
  };
});
