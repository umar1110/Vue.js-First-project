import { prisma } from "../db";

export const projectService = {
  async updateProject(
    projectId: string,
    data: {
      name?: string;
      color?: string;
      description?: string;
      createdBy?: string;
      estimatedHours?: number;
      assignedTo?: string[];
      isPinned?: boolean;
    }
  ) {
    return prisma.project.update({
      where: { id: projectId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description && { description: data.description }),
        ...(data.estimatedHours && { estimatedHours: data.estimatedHours }),
        ...(data.isPinned != undefined && { isPinned: data.isPinned }),
        ...(data.createdBy && { creator: { connect: { id: data.createdBy } } }),
        ...(data.color && { color: data.color }),
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
  async getPinnedProjectsByUserId(userId: string) {
    return prisma.project.findMany({
      where: {
        createdBy: userId,
        isPinned: true,
      },
      include: {
        creator: true,
        assignments: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
      orderBy: {
        pinnedAt: "desc",
      },
    });
  },
  async getUnpinnedProjectsByUserId(userId: string) {
    return prisma.project.findMany({
      where: {
        createdBy: userId,
        isPinned: false,
      },
      include: {
        creator: true,
        assignments: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },
  async addTimeInProject(projectId: string, time: number) {
    // time in hours
    return prisma.project.update({
      where: { id: projectId },
      data: {
        timeStatus: {
          increment: time,
        },
      },
    });
  },
  async getAssignedProjectsWithTasks(userId: string) {
    return prisma.project.findMany({
      where: {
        assignments: {
          some: {
            userId,
          },
        },
      },
      select: {
        tasks: {
          where: { assignees: { some: { userId } } },
          select: { id: true, title: true },
        },
        id: true,
        name: true,
        color: true,
      },
    });
  },
};
