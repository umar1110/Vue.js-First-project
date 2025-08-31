const routes = {
  api: {
    project: {
      index:"/api/v1/projects",
      mine: {
        index: "/api/v1/projects/mine",
      },
      assigned: {
        index: "/api/v1/projects/assigned",
      },
      tasks: {
        index: "/api/v1/projects/task",
        all: "/api/v1/projects/task/all",
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
      indexSingle: (id: string) => `/timer/projects/${id}/dashboard`,
      index: "/timer/projects",
      tasks: (id: string) => `/timer/projects/${id}/tasks`,
      team: (id: string) => `/timer/projects/${id}/team`,
      assigned: {
        indexSingle: (id: string) => `/timer/projects/assigned/${id}`,
        index: "/timer/projects/assigned",
      },
    },
  },
};

export default routes;
