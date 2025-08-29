import { projectService } from "~~/server/services/project.services";
import { taskServices } from "~~/server/services/task.services";

export default eventHandler(async (event) => {
  const body: {
    projectId: string;
    title: string;
    description: string;
    estimatedHours: number;
    assignees: string[];
  } = await readBody(event);

  const project = await projectService.getProjectById(body.projectId);

  if (!project) {
    throw createError({
      statusCode: 404,
      statusMessage: "Project not found",
      message: "The specified project could not be found."
    });
  }

  const userId = event.context.user.id;
  if (userId != project.createdBy) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
      message: "You are not allowed to modify this project."
    });
  }

  const newTask = await taskServices.createTask(body);
  if (!newTask) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create task",
      message: "An error occurred while creating the task."
    });
  }

  return {
    statusCode: 201,
    body: newTask,
  };
});
