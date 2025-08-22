import type { UserType } from "./user.types";

export interface AuthType {
  user: UserType | null;
  isAuthenticated: boolean;
  loading: boolean;
  accessToken: string | null;
  errorMessage: null|string;}
