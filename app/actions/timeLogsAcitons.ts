import routes from "~/constants/routes";

export const getRunningTimeLogAction = async () => {
  try {
    const { $axios } = useNuxtApp();
    const response = await $axios.get(routes.api.timeLogs.isRunning);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const stopRunningTimeLogAction = async ({
  timeLogId,
  description,
  projectId,
  taskId,
}: {
  timeLogId: string;
  description: string;
  projectId?: string;
  taskId?: string;
}) => {
  try {
    const { $axios } = useNuxtApp();
    const response = await $axios.put(routes.api.timeLogs.changeStatus, {
      id: timeLogId,
      status: "STOPPED",
      description,
      projectId,
      taskId,
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const startNewTimeOffAction = async ({
  projectId,
  description,
  taskId,
}: {
  projectId?: string;
  description?: string;
  taskId?: string;
}) => {
  try {
    const { $axios } = useNuxtApp();
    const response = await $axios.post(routes.api.timeLogs.new, {
      projectId,
      description,
      taskId,
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getAlltimeLogsOfProjectAction = async () => {
  try {
    const { $axios } = useNuxtApp();
    const response = await $axios.get(routes.api.timeLogs.index);
    return response.data;
  } catch (error) {
    return error;
  }
};
