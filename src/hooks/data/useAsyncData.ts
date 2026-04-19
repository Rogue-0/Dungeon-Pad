import { useCallback, useEffect, useRef, useState } from 'react';
import type { SQLiteDatabase } from 'expo-sqlite';

import { getDatabase } from '@/db/database';

export interface AsyncDataResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Run an async query against the shared DB singleton. Re-runs whenever any
 * value in `deps` changes. Callers can force a reload via the returned
 * `refetch`. Unmount-safe (late-arriving resolves are discarded).
 */
export function useAsyncData<T>(
  query: (db: SQLiteDatabase) => Promise<T>,
  deps: readonly unknown[],
): AsyncDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const run = useCallback(async () => {
    setLoading(true);
    try {
      const db = await getDatabase();
      const result = await query(db);
      if (!mounted.current) return;
      setData(result);
      setError(null);
    } catch (err) {
      if (!mounted.current) return;
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      if (mounted.current) setLoading(false);
    }
    // deps control when we re-run; query is re-created each render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    run();
  }, [run]);

  return { data, loading, error, refetch: run };
}
