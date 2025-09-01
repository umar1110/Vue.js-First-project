import { taskServices } from "~~/server/services/task.services";
import { timeLogsServices } from "~~/server/services/timelogs.services";

export default eventHandler(async (event) => {
  const body = await readBody(event);
  const { taskId, projectId, description } = body;
  const userId = event.context.user.id as string;

  const runningTimeLog = await timeLogsServices.alreadyRunningTaskTimeLog(
    userId
  );

  if (runningTimeLog) {
    return createError({
      statusCode: 409,
      statusMessage: "Conflict with existing time log",
      message: "Please stop the existing time log before starting a new one.",
    });
  }
  let timeLog = await timeLogsServices.createEmptyTimeLog(userId, description);

  if (taskId) {
    const task = await taskServices.getTaskById(taskId as string);
    if (!task) {
      throw createError({
        statusCode: 404,
        statusMessage: "Task not found",
        message: "The specified task could not be found.",
      });
    }
    const projectId = task.projectId;
    timeLog.taskId = taskId as string;
    timeLog.projectId = projectId;
  }
  if (projectId) {
    timeLog.projectId = projectId as string;
  }

  const savedTimeLog = await timeLogsServices.saveTimeLog(timeLog);
  return {
    statusCode: 201,
    timeLog: savedTimeLog,
  };
});
