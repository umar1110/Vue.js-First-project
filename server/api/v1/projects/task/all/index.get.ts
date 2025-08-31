import { taskServices } from "~~/server/services/task.services";

export default eventHandler(async (event) => {
  const query = getQuery(event);
  const projectId = query.projectId;

  const tasks = await taskServices.getTasksByProjectId(projectId as string);
  return {
    statusCode: 200,
    tasks,
  };
});
