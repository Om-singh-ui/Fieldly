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

  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // cancel previous frame
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    if (authHidden) {
      // use RAF instead of timeout → prevents race + overlap
      rafRef.current = requestAnimationFrame(() => {
        setMainVisible(true);
      });
    } else {
      rafRef.current = requestAnimationFrame(() => {
        setMainVisible(false);
      });
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
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