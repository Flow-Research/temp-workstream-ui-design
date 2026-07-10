import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";
import { createWorkstreamQueryClient } from "./queryClient";

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createWorkstreamQueryClient);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
