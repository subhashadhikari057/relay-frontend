import { useEffect } from "react";
import { applyTheme, useStore } from "@/lib/store";

/**
 * Mount once at the root to apply the persisted theme on hydration
 * and react to system preference changes.
 */
export function ThemeBoot() {
  const theme = useStore((s) => s.theme);

  useEffect(() => {
    applyTheme(theme);
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  return null;
}
