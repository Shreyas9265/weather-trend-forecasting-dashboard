import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  timeout: 120000,
});

export async function getApi(path) {
  const { data } = await api.get(path);
  return data;
}

export default api;
