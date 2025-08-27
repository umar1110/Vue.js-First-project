import { projectService } from "~~/server/services/project.services";

export default defineEventHandler(async (event) => {
  const body: {
    projectId: string;
    name?: string;
    description?: string;
    createdBy?: string;
    estimatedHours?: number;
    assignedTo?: string[];
  } = await readBody(event);

  const project = await projectService.updateProject(body);
  return {
    statusCode: 200,
    project,
  };
});
