// stores/auth.store.ts
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
      console.log("Initializing")
      const supabase = useSupabase();
      const { data } = await supabase.auth.getSession();

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
      }
      this.loading = false;

      // listen for changes (login, logout, refresh)
      supabase.auth.onAuthStateChange((event, session) => {
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

        this.loading = false;
      });
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
        const supabase = useSupabase();
        if (!supabase) {
          this.errorMessage = "Supabase client is not initialized.";
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role, name }, // stored in user metadata
          },
        });

        console.log("Sign Up Data", data);
        if (error) {
          this.errorMessage = error.message;
          return;
        }

        console.log("User signed Up", data.user);

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
        const supabase = useSupabase();
        if (!supabase) {
          this.errorMessage = "Supabase client is not initialized.";
          this.loading = false;
          return {
            success: false,
          };
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          this.errorMessage = error.message;
          this.loading = false;
          return {
            success: false,
          };
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

        return {
          success: true,
        };
      } catch (error: any) {
        this.errorMessage = error.message;
        return {
          success: false,
        };
      }
    },

    async logout() {
      const supabase = useSupabase();
      if (!supabase) {
        this.errorMessage = "Supabase client is not initialized.";
        return;
      }

      const { error } = await supabase.auth.signOut();
      if (error) {
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
      this.loading = false;

      this.setIsAuthenticated(false);
      return navigateTo("/auth/login");
    },
  },
});
