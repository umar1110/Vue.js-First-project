export default defineEventHandler(async (event) => {
  // Body
  const body = await readBody(event);
  return {
    status: 200,
    message: "I am okay ! ",
    data: body,
  };
});
