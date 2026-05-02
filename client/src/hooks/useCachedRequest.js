import { useEffect, useState } from "react";
import { api } from "../services/api";

const cache = new Map();

export function useCachedRequest(key, url, ttlMs = 30000) {
  const [data, setData] = useState(() => {
    const row = cache.get(key);
    if (!row || Date.now() - row.ts > ttlMs) return null;
    return row.data;
  });
  const [loading, setLoading] = useState(!data);

  useEffect(() => {
    let mounted = true;
    const row = cache.get(key);
    if (row && Date.now() - row.ts <= ttlMs) {
      setData(row.data);
      setLoading(false);
      return;
    }
    api
      .get(url)
      .then((res) => {
        if (!mounted) return;
        cache.set(key, { ts: Date.now(), data: res.data });
        setData(res.data);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [key, ttlMs, url]);

  return { data, loading };
}
