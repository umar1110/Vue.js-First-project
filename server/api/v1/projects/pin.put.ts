import { projectService } from "~~/server/services/project.services";

export default eventHandler(async (event) => {
  const query = getQuery(event);
  console.log(query)
  const projectId = query.projectId;
  const pinned = query.pinned == "true";

  console.log("Received pin update request:", { projectId, pinned });
  if (!projectId) {
    return createError({
      statusCode: 400,
      statusMessage: "Project ID is required",
      message: "Project ID is required",
    });
  }

  await projectService.updateProject(projectId as string, {
    isPinned: pinned,
  });

  return {
    statusCode: 200,
    message: "Project pinned status updated",
  };
});
