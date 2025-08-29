import type { UserType } from "./auth.types";

export interface TimeLogsType {
  id?: string;
  description: string;
  startTime?: Date;
  endTime?: Date;
  durationSec: number;
  status: "RUNNING" | "STOPPED";
  user?: {
    name: string;
  };
}
