import { timeLogsServices } from "~~/server/services/timelogs.services";

export default eventHandler(async (event) => {
  const user = event.context.user;
  const timeLog = await timeLogsServices.alreadyRunningTaskTimeLog(user.id);

  if (!timeLog) {
    throw {
      statusCode: 404,
      message: "No running time log found",
    };
  }

  return {
    statusCode: 200,
    timeLog,
  };
});
