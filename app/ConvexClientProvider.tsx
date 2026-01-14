"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const convex = useMemo(() => {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    
    // During build time on Vercel, if the env var isn't set, use a placeholder
    // This allows the build to complete, but the app won't work until the env var is set
    if (!convexUrl) {
      if (typeof window === "undefined") {
        // Server-side (build time) - use placeholder to prevent build errors
        return new ConvexReactClient("https://placeholder.convex.cloud");
      }
      // Client-side without URL - this shouldn't happen in production
      console.error(
        "NEXT_PUBLIC_CONVEX_URL is not set. Please add it to your environment variables."
      );
      // Still use placeholder to prevent app crash, but it won't work
      return new ConvexReactClient("https://placeholder.convex.cloud");
    }
    
    return new ConvexReactClient(convexUrl);
  }, []);

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
