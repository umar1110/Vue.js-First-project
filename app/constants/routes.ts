const routes = {
  api: {
    project: {
      mine: {
        index: "/api/v1/projects/mine",
      },
      assigned: {
        index: "/api/v1/projects/assigned",
      },
    },
    users: {
      getAll: "/api/v1/users",
    },
    timeLogs: {
      index: "api/v1/timelogs",
      isRunning: "/api/v1/timelogs/running",
      changeStatus: "/api/v1/timelogs/status",
    },
  },
  // For frontend
  client: {
    project: {
      assigned: {
        indexSingle: (id: string) => `/timer/projects/assigned/${id}`,
        index: "/timer/projects/assigned",
      },
    },
  },
};

export default routes;
