import { timeLogsServices } from "~~/server/services/timelogs.services";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { id, status, description } = body;

    if (!id || !status) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing id or status",
        message: "Missing id or status",
      });
    }
    if (!description) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing description",
        message: "Missing description",
      });
    }

    const timeLog = await timeLogsServices.changeStatus(id, status, description);

    return {
      statusCode: 200,
      timeLog,
    };
  } catch (error: any) {
    return sendError(event, error);
  }
});
