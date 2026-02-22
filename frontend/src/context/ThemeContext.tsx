import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

type ThemeMode = "system" | "light" | "dark";

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
  resolved: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "themeMode";

function getSystemTheme(): "light" | "dark" {
  // Try Telegram WebApp first
  try {
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.colorScheme) return tg.colorScheme as "light" | "dark";
  } catch {}
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    try {
      return (localStorage.getItem(STORAGE_KEY) as ThemeMode) || "system";
    } catch {
      return "system";
    }
  });

  const resolved = mode === "system" ? getSystemTheme() : mode;

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m);
    try { localStorage.setItem(STORAGE_KEY, m); } catch {}
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (resolved === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [resolved]);

  // Listen for Telegram theme changes
  useEffect(() => {
    try {
      const tg = (window as any).Telegram?.WebApp;
      if (tg?.onEvent) {
        const handler = () => {
          if (mode === "system") setModeState("system"); // force re-render
        };
        tg.onEvent("themeChanged", handler);
        return () => tg.offEvent("themeChanged", handler);
      }
    } catch {}
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, setMode, resolved }}>
      {children}
    </ThemeContext.Provider>
  );
};
