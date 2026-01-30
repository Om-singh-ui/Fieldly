"use client";

import { useEffect, useState } from "react";
import { HeaderVisibilityProvider } from "./HeaderVisibility";
import AuthHeader from "./AuthHeader";
import MainHeader from "./MainHeader";

export default function HeaderRoot() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Use setTimeout to avoid synchronous state update in effect
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <HeaderVisibilityProvider>
      <AuthHeader />
      <MainHeader />
    </HeaderVisibilityProvider>
  );
}