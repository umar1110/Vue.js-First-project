import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import type { AuthType } from "~/types/auth.types";

export const useAuthStore = defineStore("auth", () => {
  const user = reactive<AuthType["user"]>({
    name: "",
    email: "",
    role: "USER",
    id: null,
  });
  const accessToken = ref<string | null>(null);
  const isAuthenticated = ref(false);
  const loading = ref(true);
  const errorMessage = ref<string | null>(null);
  const supabase = useSupabaseClient();

  async function init() {
    console.log("Initializing auth store");
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error.message);
        errorMessage.value = error.message;
        loading.value = false;
        return;
      }

      if (data.session?.user) {
        setUser({
          id: data.session.user.id,
          name: data.session.user.user_metadata?.name || "",
          email: data.session.user.email || "",
          role: data.session.user.user_metadata?.role || "USER",
        });
        isAuthenticated.value = true;
        accessToken.value = data.session.access_token;
      } else {
        setUser({
          id: null,
          name: "",
          email: "",
          role: "USER",
        });
        isAuthenticated.value = false;
        accessToken.value = null;
      }
    } catch (error: any) {
      console.error("Init error:", error.message);
      errorMessage.value = error.message;
    } finally {
      loading.value = false;
    }

    // Listen for auth state changes (client-side only)
    // if (!process.client) return;
    // supabase.auth.onAuthStateChange((event, session) => {
    //   console.log("Auth state changed:", event, session);
    //   if (session?.user) {
    //     setUser({
    //       id: session.user.id,
    //       name: session.user.user_metadata?.name || "",
    //       email: session.user.email || "",
    //       role: session.user.user_metadata?.role || "USER",
    //     });
    //     isAuthenticated.value = true;
    //     accessToken.value = session.access_token;
    //   } else {
    //     setUser({
    //       id: null,
    //       name: "",
    //       email: "",
    //       role: "USER",
    //     });
    //     isAuthenticated.value = false;
    //     accessToken.value = null;
    //   }
    // });
  }

  async function signInWithGoogle() {
    loading.value = true;
    errorMessage.value = null;
    try {
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
      errorMessage.value = err.message;
      isAuthenticated.value = false;
      setUser({
        name: "",
        email: "",
        role: "USER",
        id: null,
      });
    } finally {
      loading.value = false;
    }
  }

  function clearErrors() {
    errorMessage.value = null;
  }

  function setUser(newUser: AuthType["user"]) {
    user.name = newUser.name;
    user.email = newUser.email;
    user.role = newUser.role;
    user.id = newUser.id;
  }

  function setIsAuthenticated(authenticated: boolean) {
    isAuthenticated.value = authenticated;
  }

  function setLoading(state: boolean) {
    loading.value = state;
  }

  async function signUp(
    name: string,
    email: string,
    password: string,
    role: "USER" | "admin" = "USER"
  ) {
    loading.value = true;
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role, name } },
      });

      if (error) {
        errorMessage.value = error.message;
        return;
      }

      const user = data.user;
      if (user) {
        const { $axios } = useNuxtApp();

        // Send user to backend (use user.id directly)
        await $axios.post("/api/v1/users", {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || "",
          role: user.user_metadata?.role || "USER",
        });

        // Set state
        setUser({
          id: user.id,
          name: user.user_metadata?.name || "",
          email: user.email || "",
          role: user.user_metadata?.role || "USER",
        });
        setIsAuthenticated(true);
      }

      return data.user;
    } finally {
      loading.value = false;
    }
  }

  async function login(email: string, password: string) {
    loading.value = true;
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login Error:", error.message);
        errorMessage.value = error.message;
        loading.value = false;
        return { success: false };
      }

      if (data.user) {
        setUser({
          id: data.user.id,
          name: data.user.user_metadata?.name || "",
          email: data.user.email || "",
          role: data.user.user_metadata?.role || "USER",
        });
        setIsAuthenticated(true);
        loading.value = false;
      }

      return { success: true };
    } catch (error: any) {
      console.error("Login Catch Error:", error.message);
      errorMessage.value = error.message;
      loading.value = false;
      return { success: false };
    }
  }

  async function logout() {
    console.log("Logging out...");
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout Error:", error.message);
      errorMessage.value = error.message;
      return;
    }

    setUser({
      name: "",
      email: "",
      role: "USER",
      id: null,
    });
    setIsAuthenticated(false);
    accessToken.value = null;
    loading.value = false;

    return navigateTo("/auth/login");
  }

  return {
    user,
    accessToken,
    isAuthenticated,
    loading,
    errorMessage,
    init,
    signInWithGoogle,
    clearErrors,
    setUser,
    setIsAuthenticated,
    setLoading,
    signUp,
    login,
    logout,
  };
});
