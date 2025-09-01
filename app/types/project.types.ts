import type { UserType } from "./auth.types";

export interface ProjectType {
  id?: string;
  name: string;
  description: string;
  estimatedHours: number;
  timeStatus: number;
  createdBy: string;
  assignedTo: string[];
  isPinned: boolean;
  creator?: UserType;
  color: string;
  timeFrameStart: Date;
  timeFrameEnd?: Date;
  status?: "OPEN" | "IN_PROGRESS" | "COMPLETED" | "ON_HOLD" | "CANCELLED";
}

export interface TaskType {
  id?: string;
  title: string;
  description: string;
  projectId: string;
  estimatedHours: number;
  timeStatus?: number;
  assignees: {
    id: string;
    taskId: string;
    userId: string;
    status: string;
    assignedAt: string;
  }[];
  status?: "OPEN" | "IN_PROGRESS" | "COMPLETED";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TaskInput {
  id?: string;
  title: string;
  description: string;
  projectId: string;
  estimatedHours: number;
  assignees: string[]; // just userIds
}

