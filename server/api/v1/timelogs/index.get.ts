import { timeLogsServices } from "~~/server/services/timelogs.services";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const projectId = query.projectId as string;
  const timeLogs = await timeLogsServices.getTimeLogsByProjectId(projectId);

  // Grouping by datess
  const grouped = timeLogs.reduce<Record<string, (typeof timeLogs)[0][]>>(
    (acc, log) => {
      const dateKey = log.startTime.toISOString().split("T")[0];
      const today = new Date();
      const yesterDay = new Date();
      yesterDay.setDate(today.getDate() - 1);
      const todayStr = today.toISOString().split("T")[0];
      const yesterDayStr = yesterDay.toISOString().split("T")[0];
      console.log("yesterday's date:", yesterDayStr);
      if (dateKey === todayStr) {
        if (!acc["Today"]) acc["Today"] = [];
        acc["Today"].push(log);
        return acc;
      } else if (dateKey === yesterDayStr) {
        if (!acc["Yesterday"]) acc["Yesterday"] = [];
        acc["Yesterday"].push(log);
        return acc;
      }

      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(log);
      return acc;
    },
    {}
  );

  const result: { date: string; logs: (typeof timeLogs) }[] = Object.entries(
    grouped
  ).map(([date, logs]) => ({ date, logs }));

  return {
    statusCode: 200,
    timeLogs: result,
  };
});
