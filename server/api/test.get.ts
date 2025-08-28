// import { serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async(event) => {
  // Param id
  //   const name = getRouterParam(event, 'name') // If route has a dynamic segment like [name]
  const query = getQuery(event);
  // const user = await serverSupabaseUser(event)
  return {
    status: 200,
    message: "I am okay ! ",
    data: {
      query: query,
    },
    // user: user,
  };
});
