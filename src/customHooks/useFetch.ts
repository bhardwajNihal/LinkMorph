// a custom hook to wrap all the fetch logic and related states

import { useCallback, useState } from "react";

export function useFetch<T, Args extends unknown[]>(
  cb: (...args: Args) => Promise<T>,
) {
  // defining states
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const callCb =  useCallback(async (...args: Args) => {        // makes the fetch stable, can now be safely used in the useEffect, avoiding unnecessary rerenders
    setLoading(true);
    setError(null);
    try {
      const res = await cb(...args);
      setData(prevData => JSON.stringify(prevData) !== JSON.stringify(res) ? res : prevData);  // ✅ Prevent unnecessary updates
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  },[cb])

  return { data, loading, error, callCb };
}
