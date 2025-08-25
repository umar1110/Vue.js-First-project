export interface AuthType {
  user: {
    name: string;
    email: string;
    role: "employee" | "admin";
    id: string | null;
    avatar: string;
  } | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  errorMessage: string | null;
}