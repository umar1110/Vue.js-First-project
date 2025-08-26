export interface AuthType {
  user: UserType;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  errorMessage: string | null;
}
export interface UserType {
  id?: string|null;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
}