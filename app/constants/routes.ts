const routes = {
  api: {
    project: {
      mine:{
        index:"/api/v1/projects/mine",
      },
      assigned:{
        index:"/api/v1/projects/assigned",
      },
     
    },
    users:{
        getAll:"/api/v1/users"
    }
  },
};

export default routes
