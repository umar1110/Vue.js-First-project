export interface AuthType {
  user: UserType | null;
  isAuthenticated: boolean;
  loading: boolean;
  accessToken: string | null;
  errorMessage: null | string;
}

export interface UserType {
  name: string;
  email: string;
  role: "employee" | "admin";
  id: string | null;
  avatar: string;
}
