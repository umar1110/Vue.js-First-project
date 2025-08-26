export interface ProjectType {
  id?: string;
  name: string;
  description: string;
  estimatedHours: number;
  createdBy: string;
  assingnedTo:string[]
}
