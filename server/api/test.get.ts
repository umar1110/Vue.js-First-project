export default defineEventHandler((event) => {
  // Param id
  //   const name = getRouterParam(event, 'name') // If route has a dynamic segment like [name]
  const query = getQuery(event);
  return {
    status: 200,
    message: "I am okay ! ",
    data: {
      query: query,
    },
  };
});
