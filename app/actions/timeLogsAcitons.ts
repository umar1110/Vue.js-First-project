import routes from "~/constants/routes";

export const getRunningTimeLogAction = async (projectId: string) => {
  try {
    const { $axios } = useNuxtApp();
    const response = await $axios.get(routes.api.timeLogs.isRunning, {
      params: { projectId },
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const stopRunningTimeLogAction = async (
  timeLogId: string,
  description: string
) => {
  try {
    const { $axios } = useNuxtApp();
    const response = await $axios.put(routes.api.timeLogs.changeStatus, {
      id: timeLogId,
      status: "STOPPED",
      description,
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const startNewTimeOffAction = async (
  projectId: string,
  description: string
) => {
  try {
    const { $axios } = useNuxtApp();
    const response = await $axios.post(routes.api.timeLogs.index, {
      projectId,
      description,
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getAlltimeLogsOfProjectAction = async (projectId: string) => {
    try {
        const { $axios } = useNuxtApp();
        const response = await $axios.get(routes.api.timeLogs.index, {
            params: { projectId },
        });
        return response.data;
    } catch (error) {
        return error;
    }
};
