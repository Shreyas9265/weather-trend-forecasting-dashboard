import { useEffect, useState } from "react";
import { getApi } from "../services/api";

export default function useFetch(path) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    const run = async () => {
      try {
        const d = await getApi(path);
        if (active) setData(d);
      } catch (e1) {
        // One retry to survive backend hot-reload windows.
        try {
          await new Promise((r) => setTimeout(r, 700));
          const d2 = await getApi(path);
          if (active) setData(d2);
        } catch (e2) {
          if (active) setError(`[${path}] ${e2.response?.data?.detail || e2.message || "Network Error"}`);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    run();
    return () => {
      active = false;
    };
  }, [path]);

  return { data, loading, error };
}
