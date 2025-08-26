export const useAuthStore = defineStore("auth", () => {
  const projects = ref([]);
  const errorMessage = ref("");

  async function fetchProjects() {
    try {
    } catch (error) {
      errorMessage.value = "Failed to fetch projects";
    }
  }
  return {
    projects,
    errorMessage,
  };
});
