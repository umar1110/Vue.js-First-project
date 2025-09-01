
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
  project?:{
    id: string;
    name: string;
    color: string;
  },
  task?: {
    id: string;
    title: string;
  }
}
