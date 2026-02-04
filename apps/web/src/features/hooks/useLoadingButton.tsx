import { useCallback, useEffect, useRef, useState } from 'react';

export function useLoadingButton(initial = false) {
  const [loading, setLoading] = useState(initial);

  const mounted = useRef(true);
  const busyRef = useRef<boolean>(initial);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const wrap = useCallback(
    <A extends unknown[], R>(fn: (...args: A) => R | Promise<R>) => {
      return async (...args: A): Promise<R | undefined> => {
        if (busyRef.current) return undefined;

        busyRef.current = true;
        setLoading(true);

        try {
          return await fn(...args);
        } finally {
          busyRef.current = false;
          if (mounted.current) setLoading(false);
        }
      };
    },
    []
  );

  return { loading, wrap, setLoading };
}
