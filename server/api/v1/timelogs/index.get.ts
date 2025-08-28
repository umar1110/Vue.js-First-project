import { timeLogsServices } from "~~/server/services/timelogs.services";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const projectId = query.projectId as string;
  const timeLogs = await timeLogsServices.getTimeLogsByProjectId(projectId);
  return {
    statusCode: 200,
    timeLogs,
  };
});
