import axios from "axios";

const api = axios.create({
  baseURL:
    "https://freelanceflow-ai-1o3w.onrender.com/api",
});

export default api;