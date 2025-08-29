import { taskServices } from "~~/server/services/task.services";

export default eventHandler(async (event) => {
  const query = getQuery(event);
  const projectId = query.projectId;
  const userId = event.context.user.id;

  const userTasks = await taskServices.getTasksByUserId(
    userId,
    projectId as string
  );

  const otherTasks = await taskServices.getTaskOtherThanUserId(
    userId,
    projectId as string
  );

  const unassignedTasks = await taskServices.getUnassignedTasks(
    projectId as string
  );
  return {
    statusCode: 200,
    body: {
      my_tasks: userTasks,
      other_tasks: otherTasks,
      unassigned_tasks: unassignedTasks,
    },
  };
});
