import type { UserType } from "./auth.types";

export interface ProjectType {
  id?: string;
  name: string;
  description: string;
  estimatedHours: number;
  createdBy: string;
  assignedTo: string[];
  creator?: UserType;
}
