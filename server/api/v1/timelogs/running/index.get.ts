import { timeLogsServices } from "~~/server/services/timelogs.services";

export default eventHandler(async (event) => {
  const query = getQuery(event);
  const projectId = query.projectId as string;
  const user = event.context.user;
  const timeLog = await timeLogsServices.isAlreadyRunningTaskByUser(
    user.id,
    projectId
  );

  if (!timeLog) {
    return {
      statusCode: 404,
      message: "No running time log found",
    };
  }

  return {
    statusCode: 200,
    timeLog,
  };
});
