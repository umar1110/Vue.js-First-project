import { projectService } from "~~/server/services/project.services";
import { taskServices } from "~~/server/services/task.services";
import { timeLogsServices } from "~~/server/services/timelogs.services";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { id, status, description, projectId, taskId } = body;

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

    const timeLog = await timeLogsServices.changeStatus(
      id,
      status,
      description
    );

    const timeLogDurationInHours = timeLog.durationSec / 3600;
    if (taskId) {
      const task = await taskServices.addTimeInTask(
        taskId as string,
        timeLogDurationInHours
      );
      if (!task) {
        throw createError({
          statusCode: 404,
          statusMessage: "Task not found",
          message: "Task not found",
        });
      }

      const projectId = task.projectId;
      const project = await projectService.addTimeInProject(
        projectId,
        timeLogDurationInHours
      );
      if (!project) {
        throw createError({
          statusCode: 404,
          statusMessage: "Project not found",
          message: "Project not found",
        });
      }
    } else if (projectId) {
      const project = await projectService.addTimeInProject(
        projectId,
        timeLogDurationInHours
      );
      if (!project) {
        throw createError({
          statusCode: 404,
          statusMessage: "Project not found",
          message: "Project not found",
        });
      }
    }
    
    return {
      statusCode: 200,
      timeLog,
    };
  } catch (error: any) {
    return sendError(event, error);
  }
});
