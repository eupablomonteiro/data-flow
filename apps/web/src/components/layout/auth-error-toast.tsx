"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function AuthErrorToast() {
  const searchParams = useSearchParams();
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const error = searchParams.get("auth_error");
    if (error && !hasShown) {
      setHasShown(true);
      toast.error(error, {
        duration: 10000,
      });
      
      const url = new URL(window.location.href);
      url.searchParams.delete("auth_error");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams, hasShown]);

  return null;
}
