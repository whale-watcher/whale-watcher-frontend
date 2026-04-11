const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface WhaleAlert {
  id: string;
  symbol: string;
  side: "buy" | "sell";
  amount: number;
  price: number;
  usd_value: number;
  wallet_address: string | null;
  detected_at: string;
}

export interface WhaleStats {
  total_whale_count: number;
  total_volume_usd: number;
  buy_volume_usd: number;
  sell_volume_usd: number;
  net_flow_usd: number;
  buy_count: number;
  sell_count: number;
  largest_trade_usd: number;
  timeframe_hours: number;
}

export interface SymbolStats {
  symbol: string;
  alert_count: number;
  total_volume_usd: number;
}

export async function fetchRecentWhales(
  symbol?: string,
  limit: number = 50
): Promise<WhaleAlert[]> {
  const params = new URLSearchParams();
  if (symbol) params.set("symbol", symbol);
  params.set("limit", limit.toString());

  const response = await fetch(`${API_URL}/api/v1/whales/recent?${params}`);
  if (!response.ok) throw new Error("Failed to fetch whales");
  return response.json();
}

export async function fetchWhaleStats(
  symbol?: string,
  hours: number = 24
): Promise<WhaleStats> {
  const params = new URLSearchParams();
  if (symbol) params.set("symbol", symbol);
  params.set("hours", hours.toString());

  const response = await fetch(`${API_URL}/api/v1/whales/stats?${params}`);
  if (!response.ok) throw new Error("Failed to fetch stats");
  return response.json();
}

export async function fetchSymbols(): Promise<SymbolStats[]> {
  const response = await fetch(`${API_URL}/api/v1/whales/symbols`);
  if (!response.ok) throw new Error("Failed to fetch symbols");
  return response.json();
}

export async function fetchMarkets(): Promise<any[]> {
  const response = await fetch(`${API_URL}/api/v1/markets`);
  if (!response.ok) throw new Error("Failed to fetch markets");
  return response.json();
}

export interface TradeSignal {
  symbol: string;
  direction: "LONG" | "SHORT" | "HOLD";
  confidence: number;
  imbalance_pct: number;
  imbalance_signal: string;
  whale_buy_pct: number;
  whale_count: number;
  reasons: string[];
  timestamp: number;
}

export async function fetchSignals(symbol?: string): Promise<Record<string, TradeSignal> | TradeSignal> {
  const params = symbol ? `?symbol=${symbol}` : "";
  const response = await fetch(`${API_URL}/api/v1/trading/signals${params}`);
  if (!response.ok) throw new Error("Failed to fetch signals");
  return response.json();
}

export async function fetchAccount(walletAddress: string): Promise<any> {
  const response = await fetch(`${API_URL}/api/v1/trading/account?account=${walletAddress}`);
  if (!response.ok) throw new Error("Failed to fetch account");
  return response.json();
}

export async function fetchPositions(walletAddress: string): Promise<any> {
  const response = await fetch(`${API_URL}/api/v1/trading/positions?account=${walletAddress}`);
  if (!response.ok) throw new Error("Failed to fetch positions");
  return response.json();
}

export async function fetchOrders(walletAddress: string): Promise<any> {
  const response = await fetch(`${API_URL}/api/v1/trading/orders?account=${walletAddress}`);
  if (!response.ok) throw new Error("Failed to fetch orders");
  return response.json();
}
