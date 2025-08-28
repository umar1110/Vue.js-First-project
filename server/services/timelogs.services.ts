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
    const timeLog = await prisma.timeLog.findUnique({ where: { id } });
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
    });
  },
};
