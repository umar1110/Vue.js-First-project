import { prisma } from "../db";

export const taskServices = {
  createTask: async (data: {
    projectId: string;
    title: string;
    description: string;
    estimatedHours: number;
    assignees: string[];
  }) => {
    console.log("Creating task:", data);
    const newTask = await prisma.task.create({
      data: {
        projectId: data.projectId,
        title: data.title,
        description: data.description,
        estimatedHours: data.estimatedHours,
        assignees: {
          create: data.assignees.map((userId) => ({
            user: { connect: { id: userId } },
          })),
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
  getTasksByProjectId: async (projectId: string) => {
    const tasks = await prisma.task.findMany({
      where: {
        projectId: projectId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        assignees: true,
      },
    });
    return tasks;
  },
  updateTask: async (
    id: string,
    data: {
      title?: string;
      description?: string;
      estimatedHours?: number;
      assignees?: string[];
    }
  ) => {
    const updateData: any = {
      title: data.title,
      description: data.description,
      estimatedHours: data.estimatedHours,
    };

    // Only touch assignees if the field exists in request
    if (data.assignees !== undefined) {
      updateData.assignees = {
        deleteMany: {}, // clear all existing
        create: data.assignees.map((userId) => ({
          user: { connect: { id: userId } },
        })),
      };
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData,
    });

    return updatedTask;
  },
  addTimeInTask: async (taskId: string, time: number) => {
    // time in hours
    return prisma.task.update({
      where: { id: taskId },
      data: {
        timeStatus: {
          increment: time,
        },
      },
    });
  },
};
