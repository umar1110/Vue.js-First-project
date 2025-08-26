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
      console.error("API Error:", error.response?.data || error.message);
      return Promise.reject(error);
    }
  );
  return {
    provide: {
      axios: api,
    },
  };
});
