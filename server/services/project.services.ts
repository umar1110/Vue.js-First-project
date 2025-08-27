import { prisma } from "../db";

export const projectService = {
  async updateProject(data: {
    projectId: string;
    name?: string;
    description?: string;
    createdBy?: string;
    estimatedHours?: number;
    assignedTo?: string[];
  }) {
    
    return prisma.project.update({
      where: { id: data.projectId },
      data: {
        name: data.name,
        description: data.description,
        estimatedHours: data.estimatedHours,
        ...(data.createdBy && { creator: { connect: { id: data.createdBy } } }),
        ...(data.assignedTo && {
          assignments: {
            deleteMany: {}, 
            create: data.assignedTo.map((userId) => ({
              user: { connect: { id: userId } },
            })),
          },
        }),
      },
      include: {
        creator: true,
        assignments: { include: { user: true } },
      },
    });
  },
  async deleteProject(projectId: string) {
    return prisma.project.delete({
      where: { id: projectId },
    });
  },
};
