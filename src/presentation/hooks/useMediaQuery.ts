import { useSyncExternalStore } from "react";

export function useMediaQuery(query: string): boolean {
  const mql = window.matchMedia(query);

  return useSyncExternalStore(
    (cb) => {
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    () => mql.matches,
    () => false,
  );
}
