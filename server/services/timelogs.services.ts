import { TimeLog } from "@prisma/client";
import { prisma } from "../db";

export const timeLogsServices = {
  createTimeLog: async (data: {
    description: string;
    projectId: string;
    userId: string;
  }) => {
    return prisma.timeLog.create({
      data: {
        description: data.description,
        startTime: new Date(),
        projectId: data.projectId,
        userId: data.userId,
        status: "RUNNING",
        durationSec: 0,
      },
    });
  },
  changeStatus: async (
    id: string,
    status: "STOPPED", // Will extend for pause resume
    description: string
  ) => {
    const timeLog = await prisma.timeLog.findUnique({
      where: { id },
      include: {
        project: { select: { id: true, name: true } },
        task: { select: { id: true, title: true } },
      },
    });
    if (!timeLog) {
      throw new Error("Time log not found");
    }
    if (timeLog.status === status) {
      return timeLog;
    }
    const startTime = timeLog.startTime;
    if (status == "STOPPED") {
      return prisma.timeLog.update({
        where: { id },
        data: {
          status,
          description,
          endTime: new Date(),
          durationSec: Math.floor((Date.now() - startTime.getTime()) / 1000),
        },
        include: {
          project: {
            select: {
              id: true,
              name: true,
            },
          },
          task: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });
    }

    return timeLog;
  },
  isAlreadyRunningTaskByUser: async (userId: string, projectId: string) => {
    return prisma.timeLog.findFirst({
      where: {
        userId,
        projectId,
        status: "RUNNING",
      },
    });
  },
  getTimeLogsByProjectId: async (projectId: string) => {
    return prisma.timeLog.findMany({
      where: {
        projectId,
      },
      orderBy: {
        startTime: "desc",
      },
      // Include only name of user
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });
  },
  addTimeLogInTask: async (data: {
    taskId: string;
    projectId: string;
    description: string;
    userId: string;
  }) => {
    return prisma.timeLog.create({
      data: {
        taskId: data.taskId,
        projectId: data.projectId,
        startTime: new Date(),
        status: "RUNNING",
        durationSec: 0,
        description: data.description,
        userId: data.userId,
      },
    });
  },
  // Updated Services according to tasks added in projects
  alreadyRunningTaskTimeLogInAProject: async (data: {
    taskId: string;
    userId: string;
    projectId: string;
  }) => {
    return prisma.timeLog.findFirst({
      where: {
        taskId: data.taskId,
        userId: data.userId,
        projectId: data.projectId,
        status: "RUNNING",
      },
    });
  },
  alreadyRunningTaskTimeLog: async (userId: string) => {
    return prisma.timeLog.findFirst({
      where: {
        userId,
        status: "RUNNING",
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        task: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  },
  createEmptyTimeLog: async (userId: string, description?: string) => {
    return prisma.timeLog.create({
      data: {
        userId,
        description: description || "",
        startTime: new Date(),
      },
    });
  },
  saveTimeLog: async (timeLog: TimeLog) => {
    return prisma.timeLog.update({
      where: { id: timeLog.id },
      data: timeLog,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        task: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  },
  getTimeLogsByUserId: async (userId: string) => {
    return prisma.timeLog.findMany({
      where: {
        userId,
        NOT: {
          status: "RUNNING",
        },
      },
      orderBy: {
        startTime: "desc",
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        task: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  },
};
