export interface UserType {
  name: string;
  email: string;
  role: "employee" | "admin";
  id: string | null;
  avatar: string;
}
