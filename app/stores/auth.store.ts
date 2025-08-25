import { defineStore } from "pinia";
import type { AuthType } from "~/types/auth.types";

export const useAuthStore = defineStore("auth", {
  state: (): AuthType => ({
    user: {
      name: "",
      email: "",
      role: "employee",
      id: null,
      avatar: "",
    },
    accessToken: null,
    isAuthenticated: false,
    loading: true,
    errorMessage: null,
  }),

  actions: {
    async init() {
      console.log("Initializing auth store");
      const supabase = useSupabaseClient(); // Use Nuxt Supabase client
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error fetching session:", error.message);
          this.errorMessage = error.message;
          this.loading = false;
          return;
        }

        console.log("Session data:", data);

        if (data.session?.user) {
          this.setUser({
            id: data.session.user.id,
            name: data.session.user.user_metadata?.name || "",
            email: data.session.user.email || "",
            role: data.session.user.user_metadata?.role || "employee",
            avatar: data.session.user.user_metadata?.avatar || "",
          });
          this.isAuthenticated = true;
          this.accessToken = data.session.access_token;
        } else {
          this.setUser({
            id: null,
            name: "",
            email: "",
            role: "employee",
            avatar: "",
          });
          this.isAuthenticated = false;
          this.accessToken = null;
        }
      } catch (error: any) {
        console.error("Init error:", error.message);
        this.errorMessage = error.message;
      } finally {
        this.loading = false;
      }

      // Listen for auth state changes (client-side only)
      if (!process.client) return;
      supabase.auth.onAuthStateChange((event, session) => {
        console.log("Auth state changed:", event, session);
        if (session?.user) {
          this.setUser({
            id: session.user.id,
            name: session.user.user_metadata?.name || "",
            email: session.user.email || "",
            role: session.user.user_metadata?.role || "employee",
            avatar: session.user.user_metadata?.avatar || "",
          });
          this.isAuthenticated = true;
          this.accessToken = session.access_token;
        } else {
          this.setUser({
            id: null,
            name: "",
            email: "",
            role: "employee",
            avatar: "",
          });
          this.isAuthenticated = false;
          this.accessToken = null;
        }
      });
    },
    async signInWithGoogle() {
      this.loading = true;
      this.errorMessage = null;
      try {
        const supabase = useSupabaseClient();
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: "http://localhost:3000/auth/callback",
            queryParams: {
              access_type: "offline",
              prompt: "consent",
            },
          },
        });
        if (error) throw error;
      } catch (err: any) {
        this.errorMessage = err.message;
        this.isAuthenticated = false;
        this.user = null;
      } finally {
        this.loading = false;
      }
    },
    clearErrors() {
      this.errorMessage = null;
    },

    setUser(user: AuthType["user"]) {
      this.user = user;
    },

    setIsAuthenticated(isAuthenticated: boolean) {
      this.isAuthenticated = isAuthenticated;
    },

    setLoading(loading: boolean) {
      this.loading = loading;
    },

    async signUp(
      name: string,
      email: string,
      password: string,
      role: "employee" | "admin" = "employee"
    ) {
      this.loading = true;
      try {
        const supabase = useSupabaseClient();
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role, name }, // Store in user_metadata
          },
        });

        console.log("Sign Up Data:", data);
        if (error) {
          console.error("Sign Up Error:", error.message);
          this.errorMessage = error.message;
          return;
        }

        if (data.user) {
          this.setUser({
            id: data.user.id,
            name: data.user.user_metadata?.name || "",
            email: data.user.email || "",
            role: data.user.user_metadata?.role || "employee",
            avatar: data.user.user_metadata?.avatar || "",
          });
          this.setIsAuthenticated(true);
        }

        return data.user;
      } finally {
        this.loading = false;
      }
    },

    async login(email: string, password: string) {
      this.loading = true;
      try {
        const supabase = useSupabaseClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error("Login Error:", error.message);
          this.errorMessage = error.message;
          this.loading = false;
          return { success: false };
        }

        if (data.user) {
          this.setUser({
            id: data.user.id,
            name: data.user.user_metadata?.name || "",
            email: data.user.email || "",
            role: data.user.user_metadata?.role || "employee",
            avatar: data.user.user_metadata?.avatar || "",
          });
          this.setIsAuthenticated(true);
          this.loading = false;
        }

        return { success: true };
      } catch (error: any) {
        console.error("Login Catch Error:", error.message);
        this.errorMessage = error.message;
        this.loading = false;
        return { success: false };
      }
    },

    async logout() {
      const supabase = useSupabaseClient();
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout Error:", error.message);
        this.errorMessage = error.message;
        return;
      }

      this.setUser({
        name: "",
        email: "",
        role: "employee",
        id: null,
        avatar: "",
      });
      this.setIsAuthenticated(false);
      this.accessToken = null;
      this.loading = false;

      return navigateTo("/auth/login");
    },
  },
});
