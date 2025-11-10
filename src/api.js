import axios from "axios";

const api = axios.create({
  baseURL: "https://api-tnm.tutor-nearme.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✅ include cookies in every request
});



export default api;
