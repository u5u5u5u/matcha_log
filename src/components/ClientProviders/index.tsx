"use client";
import { SessionProvider } from "next-auth/react";
import { SWRConfig } from "swr";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <SWRConfig
        value={{
          refreshInterval: 60000, // 60秒ごとに自動更新
          revalidateOnFocus: false, // フォーカス時の再検証を無効化
          dedupingInterval: 5000, // 5秒間の重複リクエストを防ぐ
        }}
      >
        {children}
      </SWRConfig>
    </SessionProvider>
  );
}
