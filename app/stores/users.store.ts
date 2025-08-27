// Users store

import { getAllUsersAction } from "~/actions/userActions";
import type { UserType } from "~/types/auth.types";

export const useUsersStore = defineStore("user", () => {
  const users = ref<UserType[]>([]);
  const isUsersFetched = ref<boolean>(false);
  const loading = ref<boolean>(false);

  async function fetchUsers(): Promise<void> {
    loading.value = true;
    try {
      const response = await getAllUsersAction();
      console.log("Fetched users:", response);
      if (response.status == 200) {
        users.value = response.users;
        isUsersFetched.value = true;
      } else {
        console.error("Error fetching users:", response);
        users.value = [];
        isUsersFetched.value = false;
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      loading.value = false;
    }
  };

  return {
    users,
    isUsersFetched,
    loading,
    fetchUsers,
  };
});
