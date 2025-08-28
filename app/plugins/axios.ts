import axios from "axios";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const api = axios.create({
    baseURL: config.public.apiBase || "http://localhost:3000",
    headers: {
      "Content-Type": "application/json",
    },
  });

  //   api.interceptors.request.use((request) => {
  //     const token = useCookie("token").value;
  //     if (token) {
  //       request.headers.Authorization = `Bearer ${token}`;
  //     }
  //     return request;
  //   });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      console.log("Full error log : =========> ", error);
      if (error.response) {
        return Promise.reject({
          success: false,
          error: true,
          statusCode: error.response.status,
          message: error.response.data?.statusMessage || error.response.data?.message || "Server Error",
          data: error.response.data,
        });
      } else if (error.request) {
        return Promise.reject({
          success: false,
          error: true,
          statusCode: 0,
          message: "Network error. Please check your connection.",
        });
      } else {
        // something else
        return Promise.reject({
          success: false,
          error: true,
          statusCode: -1,
          message: error.message || "Unexpected error",
        });
      }
    }
  );

  return {
    provide: {
      axios: api,
    },
  };
});
