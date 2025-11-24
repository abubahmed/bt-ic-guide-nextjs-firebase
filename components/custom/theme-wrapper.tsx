"use client";

import { useEffect } from "react";
import { applyTheme } from "@/themes/applyTheme";
import type { ThemeName } from "@/themes/theme";

export default function ThemeWrapper({ theme, children }: { theme: ThemeName; children: React.ReactNode }) {
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return <>{children}</>;
}
