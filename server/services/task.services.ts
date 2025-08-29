import { prisma } from "../db";

export const taskServices = {
  createTask: async (data: {
    projectId: string;
    title: string;
    description: string;
    estimatedHours: number;
    assignees: string[];
  }) => {
    const newTask = await prisma.task.create({
      data: {
        projectId: data.projectId,
        title: data.title,
        description: data.description,
        estimatedHours: data.estimatedHours,
        assignees: {
          connect: data.assignees.map((id) => ({ id })),
        },
      },
    });

    return newTask;
  },
  getTaskById: async (id: string) => {
    const task = await prisma.task.findUnique({
      where: { id },
    });
    return task;
  },
  getTasksByUserId: async (userId: string, projectId: string) => {
    const tasks = await prisma.task.findMany({
      where: {
        projectId: projectId,
        assignees: {
          some: {
            id: userId,
          },
        },
      },
    });
    return tasks;
  },
  getTaskOtherThanUserId: async (userId: string, projectId: string) => {
    const tasks = await prisma.task.findMany({
      where: {
        projectId: projectId,
        assignees: {
          none: {
            id: userId,
          },
          some: {},
        },
      },
    });
    return tasks;
  },
  getUnassignedTasks: async (projectId: string) => {
    const tasks = await prisma.task.findMany({
      where: {
        projectId: projectId,
        assignees: {
          none: {},
        },
      },
    });
    return tasks;
  },
};
