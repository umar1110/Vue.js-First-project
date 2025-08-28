import { prisma } from "../db";

export const projectService = {
  async updateProject(
    projectId: string,
    data: {
      name?: string;
      description?: string;
      createdBy?: string;
      estimatedHours?: number;
      assignedTo?: string[];
    }
  ) {
    return prisma.project.update({
      where: { id: projectId },
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
  async getProjectById(projectId: string) {
    return prisma.project.findUnique({
      where: { id: projectId },
      include: {
        creator: true,
      },
    });
  },
  async getProjectByUserId(userId: string) {
    return prisma.project.findMany({
      where: { createdBy: userId },
      include: {
        creator: true,
      },
    });
  },
  async isAssignment(userId: string, projectId: string) {
    return prisma.project.findUnique({
      where: { id: projectId },
      select: {
        assignments: {
          where: { userId },
        },
      },
    });
  },
};
