// get logged in user
import { serverSupabaseClient } from "#supabase/server";
import { prisma } from "~~/server/db";

export default defineEventHandler(async (event) => {
  
  const supabase = await serverSupabaseClient(event);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw createError({ statusCode: 500, message: error.message });
  }

  if (!user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  //  get user with id
  const userId = user.id;
  const userData = await prisma.user.findUnique({
    where: { id: userId },
  });

  return {
    status: 200,
    user: userData,
  };
});
