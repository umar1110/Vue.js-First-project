import { PrismaClient } from "@prisma/client";

export default defineNuxtPlugin(() => {
  const prisma = new PrismaClient();
  return {
    provide: {
      prisma,
    },
  };
});
