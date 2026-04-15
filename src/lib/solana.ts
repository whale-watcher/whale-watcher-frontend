const SUPPORTED_SOLANA_CLUSTERS = ["devnet", "mainnet", "testnet"] as const;

type SolanaClusterName = (typeof SUPPORTED_SOLANA_CLUSTERS)[number];
type PrivySolanaChain = `solana:${SolanaClusterName}`;

function isSupportedSolanaCluster(value: string): value is SolanaClusterName {
  return SUPPORTED_SOLANA_CLUSTERS.includes(value as SolanaClusterName);
}

const configuredCluster = process.env.NEXT_PUBLIC_SOLANA_CLUSTER?.toLowerCase();
const normalizedCluster = configuredCluster ?? "";

// Keep the active Solana cluster in one place so Privy hooks and UI stay aligned.
export const SOLANA_CLUSTER: SolanaClusterName = isSupportedSolanaCluster(
  normalizedCluster,
)
  ? normalizedCluster
  : "devnet";

export const PRIVY_SOLANA_CHAIN: PrivySolanaChain = `solana:${SOLANA_CLUSTER}`;

export const SOLANA_NETWORK_LABEL =
  SOLANA_CLUSTER.charAt(0).toUpperCase() + SOLANA_CLUSTER.slice(1);
