"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

type HeaderVisibilityContextType = {
  authHidden: boolean;
  setAuthHidden: (v: boolean) => void;
  mainVisible: boolean;
};

const HeaderVisibilityContext =
  createContext<HeaderVisibilityContextType | null>(null);

export function HeaderVisibilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authHidden, setAuthHidden] = useState(false);
  const [mainVisible, setMainVisible] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any pending timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (authHidden) {
      // ⏳ Show main header with 800ms delay (gap between headers)
      timerRef.current = setTimeout(() => {
        setMainVisible(true);
      }, 800);
    } else {
      // Hide main header immediately, show auth header
      // Use setTimeout to avoid synchronous state update
      timerRef.current = setTimeout(() => {
        setMainVisible(false);
      }, 0);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [authHidden]);

  return (
    <HeaderVisibilityContext.Provider
      value={{ authHidden, setAuthHidden, mainVisible }}
    >
      {children}
    </HeaderVisibilityContext.Provider>
  );
}

export function useHeaderVisibility() {
  const ctx = useContext(HeaderVisibilityContext);
  if (!ctx) {
    throw new Error(
      "useHeaderVisibility must be used inside HeaderVisibilityProvider"
    );
  }
  return ctx;
}