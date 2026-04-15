"use client";

import { PrivyProvider, type WalletListEntry } from "@privy-io/react-auth";
import {
  toSolanaWalletConnectors,
} from "@privy-io/react-auth/solana";
import { WhaleWebSocketProvider } from "@/contexts/WhaleWebSocketContext";

const solanaConnectors = toSolanaWalletConnectors({
  shouldAutoConnect: false,
});

const solanaWalletList: WalletListEntry[] = [
  "detected_solana_wallets",
  "phantom",
  "wallet_connect_qr_solana",
];

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
          walletList: solanaWalletList,
          walletChainType: "solana-only",
        },
        externalWallets: {
          solana: {
            connectors: solanaConnectors,
          },
        },
      }}
    >
      <WhaleWebSocketProvider>{children}</WhaleWebSocketProvider>
    </PrivyProvider>
  );
}
