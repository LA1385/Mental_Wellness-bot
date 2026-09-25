import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "../api/client";

export type AsyncDataResult<T> = {
  data: T | null;
  loading: boolean;
  refreshing: boolean;
  error: ApiError | null;
  refetch: () => void;
};

// The shared hook owns loading, errors, races, and unmount cleanup for every resource hook.
export function useAsyncData<T>(
  fetchFunction: () => Promise<T>,
): AsyncDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const requestId = useRef(0);
  const hasLoadedData = useRef(false);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  const execute = useCallback(async () => {
    const currentRequestId = requestId.current + 1;
    requestId.current = currentRequestId;
    const isInitialRequest = !hasLoadedData.current;

    if (isInitialRequest) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      const nextData = await fetchFunction();

      if (!isMounted.current || currentRequestId !== requestId.current) {
        return;
      }

      setData(nextData);
      hasLoadedData.current = true;
      setError(null);
    } catch (caughtError) {
      if (!isMounted.current || currentRequestId !== requestId.current) {
        return;
      }

      const nextError =
        caughtError instanceof ApiError
          ? caughtError
          : new ApiError(0, "Unable to load dashboard data");

      setError(nextError);
    } finally {
      if (isMounted.current && currentRequestId === requestId.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [fetchFunction]);

  useEffect(() => {
    void execute();
  }, [execute]);

  const refetch = useCallback(() => {
    void execute();
  }, [execute]);

  return { data, loading, refreshing, error, refetch };
}
