import React, { createContext, useContext, useRef, useCallback } from "react";

interface ScrollState {
  scrollY: number;
  activeCategory: string;
  search: string;
}

interface ScrollContextType {
  save: (state: ScrollState) => void;
  restore: () => ScrollState | null;
  clear: () => void;
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export const useScrollRestore = () => {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error("useScrollRestore must be used within ScrollProvider");
  return ctx;
};

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const stateRef = useRef<ScrollState | null>(null);

  const save = useCallback((state: ScrollState) => {
    stateRef.current = state;
    try {
      sessionStorage.setItem("catalog-scroll", JSON.stringify(state));
    } catch {}
  }, []);

  const restore = useCallback((): ScrollState | null => {
    if (stateRef.current) return stateRef.current;
    try {
      const raw = sessionStorage.getItem("catalog-scroll");
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  }, []);

  const clear = useCallback(() => {
    stateRef.current = null;
    sessionStorage.removeItem("catalog-scroll");
  }, []);

  return (
    <ScrollContext.Provider value={{ save, restore, clear }}>
      {children}
    </ScrollContext.Provider>
  );
};
