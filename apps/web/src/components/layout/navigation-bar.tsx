"use client";

import { useRouteLoading } from "@/hooks/use-route-loading";
import { AuthErrorToast } from "./auth-error-toast";

export function NavigationBar() {
  const { isLoading } = useRouteLoading();

  return (
    <>
      <AuthErrorToast />
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 z-[9999] h-0.5 bg-df-accent/20">
          <div className="h-full bg-df-accent animate-navigation-bar" />
        </div>
      )}
    </>
  );
}
