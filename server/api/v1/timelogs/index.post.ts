import { projectService } from "~~/server/services/project.services";
import { timeLogsServices } from "~~/server/services/timelogs.services";

export default defineEventHandler(async (event) => {
  try {
    const body: {
      projectId: string;
      description: string;
    } = await readBody(event);

    if (!body) {
      return createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "Invalid request body",
      });
    }

    // Check is user assigned to that project
    const assignedProject = await projectService.isAssignment(
      event.context.user.id,
      body.projectId
    );

    if (!assignedProject) {
      return createError({
        statusCode: 403,
        statusMessage: "Forbidden",
        message: "User is not assigned to this project",
      });
    }

    const runningTask = await timeLogsServices.isAlreadyRunningTaskByUser(
      event.context.user.id,
      body.projectId
    );

    if (runningTask) {
      return createError({
        statusCode: 409,
        message: "User already has a running task in this project",
      });
    }
    const timeLog = await timeLogsServices.createTimeLog({
      description: body.description,
      projectId: body.projectId,
      userId: event.context.user.id,
    });

    return {
      statusCode: 201,
      timeLog: timeLog,
    };
  } catch (error) {
    return createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "An error occurred while creating the time log."
    });
  }
});
