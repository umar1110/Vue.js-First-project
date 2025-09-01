import { projectService } from "~~/server/services/project.services";
import { taskServices } from "~~/server/services/task.services";

export default eventHandler(async (event) => {
  const body: {
    taskId: string;
    title?: string;
    description?: string;
    estimatedHours?: number;
    assignees?: string[];
  } = await readBody(event);

  const task = await taskServices.getTaskById(body.taskId);

  if (!task) {
    throw createError({
      statusCode: 404,
      statusMessage: "Task not found",
      message: "The specified task could not be found.",
    });
  }

  const project = await projectService.getProjectById(task.projectId);

  if (!project) {
    throw createError({
      statusCode: 404,
      statusMessage: "Project not found",
      message: "The specified project could not be found.",
    });
  }

  const userId = event.context.user.id;
  if (userId != project.createdBy) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
      message: "You are not allowed to modify this task.",
    });
  }

  const newTask = await taskServices.updateTask(task.id, body);

  if (!newTask) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to update task",
      message: "An error occurred while updating the task.",
    });
  }

  return {
    statusCode: 201,
    body: newTask,
  };
});
