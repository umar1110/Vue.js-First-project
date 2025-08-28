import routes from "~/constants/routes";

export const getAllUsersAction = async () => {
  try {
    const { $axios } = useNuxtApp();
    const response = await $axios.get(routes.api.users.getAll);
    return response.data;
  } catch (error) {
    return error;
  }
};
