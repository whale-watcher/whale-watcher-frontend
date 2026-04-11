"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { WhaleWebSocketProvider } from "@/contexts/WhaleWebSocketContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  if (!appId) {
    console.warn("NEXT_PUBLIC_PRIVY_APP_ID is not set");
    return <WhaleWebSocketProvider>{children}</WhaleWebSocketProvider>;
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        loginMethods: ["wallet", "email"],
        appearance: {
          theme: "dark",
          accentColor: "#3B82F6",
          showWalletLoginFirst: true,
        },
      }}
    >
      <WhaleWebSocketProvider>{children}</WhaleWebSocketProvider>
    </PrivyProvider>
  );
}
