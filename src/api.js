// // src/api.js
// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://tnm-test-api.dhanwis.com/api",
// });

// // Attach token automatically
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Token ${token}`; // Basic token
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default api;
// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://tnm-test-api.dhanwis.com/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Attach token automatically
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Token ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default api;
import axios from "axios";


const api = axios.create({
  baseURL: "http://tnm-test-api.dhanwis.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

