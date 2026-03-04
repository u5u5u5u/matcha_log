"use client";
import { AuthProvider } from "@/components/AuthProvider";
import { SWRConfig } from "swr";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SWRConfig
        value={{
          refreshInterval: 60000,
          revalidateOnFocus: false,
          dedupingInterval: 5000,
        }}
      >
        {children}
      </SWRConfig>
    </AuthProvider>
  );
}
