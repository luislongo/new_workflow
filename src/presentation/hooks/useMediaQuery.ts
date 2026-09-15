import { useCallback, useMemo, useSyncExternalStore } from "react";

export function useMediaQuery(query: string): boolean {
  const mql = useMemo(
    () => (typeof window === "undefined" ? null : window.matchMedia(query)),
    [query],
  );

  const subscribe = useCallback(
    (cb: () => void) => {
      if (!mql) return () => {};
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    [mql],
  );

  return useSyncExternalStore(
    subscribe,
    () => mql?.matches ?? false,
    () => false,
  );
}
