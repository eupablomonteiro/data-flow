"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./client";

type Props = {
  children: React.ReactNode;
};

export function ReactQueryProvider({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
