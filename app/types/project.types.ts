import type { UserType } from "./auth.types";

export interface ProjectType {
  id?: string;
  name: string;
  description: string;
  estimatedHours: number;
  timeStatus: number;
  createdBy: string;
  assignedTo: string[];
  creator?: UserType;
  color: string;
  timeFrameStart: Date;
  timeFrameEnd?: Date;
  status?: "OPEN" | "IN_PROGRESS" | "COMPLETED" | "ON_HOLD" | "CANCELLED";
}
