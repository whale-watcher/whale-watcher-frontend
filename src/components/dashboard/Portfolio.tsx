"use client";

import { useEffect, useState } from "react";
import { fetchAccount, fetchPositions } from "@/lib/api";
import { formatUSD, cn } from "@/lib/utils";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  DollarSign,
  ShieldCheck,
  ArrowUpDown,
} from "lucide-react";

interface PortfolioProps {
  walletAddress?: string;
}

interface AccountData {
  balance: string;
  account_equity: string;
  available_to_spend: string;
  available_to_withdraw: string;
  total_margin_used: string;
  positions_count: number;
  orders_count: number;
  maker_fee: string;
  taker_fee: string;
}

interface Position {
  symbol: string;
  side: string;
  size: string;
  entry_price: string;
  mark_price: string;
  unrealized_pnl: string;
  leverage: number;
  margin_mode: string;
}

export function Portfolio({ walletAddress }: PortfolioProps) {
  const [account, setAccount] = useState<AccountData | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    if (!walletAddress) return;
    setLoading(true);
    setError(null);

    try {
      const [accResp, posResp] = await Promise.all([
        fetchAccount(walletAddress),
        fetchPositions(walletAddress),
      ]);

      if (accResp?.success && accResp.data) {
        setAccount(accResp.data);
      } else if (accResp?.data) {
        setAccount(accResp.data);
      }

      if (posResp?.success && posResp.data) {
        setPositions(Array.isArray(posResp.data) ? posResp.data : []);
      } else if (Array.isArray(posResp?.data)) {
        setPositions(posResp.data);
      }
    } catch (e) {
      setError("Could not load account data. Make sure the wallet has a Pacifica account.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    if (walletAddress) {
      const interval = setInterval(loadData, 15000);
      return () => clearInterval(interval);
    }
  }, [walletAddress]);

  // No wallet connected
  if (!walletAddress) {
    return (
      <div className="space-y-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
          <Wallet size={40} className="mx-auto text-blue-500 mb-4" />
          <h3 className="text-xl font-bold mb-2">Pacifica Portfolio</h3>
          <p className="text-sm text-zinc-400 mb-6 max-w-sm mx-auto">
            Connect your Solana wallet to view your account balance, open positions, and unrealized PnL on Pacifica.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://app.pacifica.fi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Open Pacifica to Deposit
              <ExternalLink size={14} />
            </a>
            <a
              href="https://test-app.pacifica.fi/faucet"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Get Testnet Token (Solana Devnet)
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* What you'll see */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-800">
            <h3 className="font-semibold text-sm text-zinc-400">What you&apos;ll see after connecting</h3>
          </div>
          <div className="p-4 grid grid-cols-2 gap-3">
            {[
              { label: "Account Equity", example: "$2,150.25", color: "text-green-500" },
              { label: "Balance", example: "$2,000.00", color: "text-blue-500" },
              { label: "Margin Used", example: "$349.50", color: "text-purple-500" },
              { label: "Available to Trade", example: "$1,800.75", color: "text-cyan-500" },
            ].map(({ label, example, color }) => (
              <div key={label} className="bg-zinc-800/50 rounded-lg p-3">
                <div className="text-xs text-zinc-500 mb-1">{label}</div>
                <div className={cn("text-lg font-bold opacity-40", color)}>{example}</div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-zinc-800 bg-zinc-950">
            <p className="text-xs text-zinc-500">
              Open positions, unrealized PnL, and order count will also be displayed.
            </p>
          </div>
        </div>

        {/* How to get started */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h3 className="font-semibold mb-4">How to get started</h3>
          <div className="space-y-3">
            {[
              { step: "1", text: "Connect your Solana wallet using the button in the top-right" },
              { step: "2", text: "Deposit USDC on Pacifica (or get free testnet USDC from the faucet)" },
              { step: "3", text: "Your balance, positions, and PnL will appear here automatically" },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-start gap-3">
                <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                  {step}
                </span>
                <span className="text-sm text-zinc-400">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (loading && !account) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 bg-zinc-800 rounded" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-20 bg-zinc-800 rounded-lg" />
            <div className="h-20 bg-zinc-800 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Account Overview */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet size={18} className="text-blue-500" />
            <h3 className="font-semibold">Portfolio</h3>
            <span className="text-xs text-zinc-500 font-mono">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </span>
          </div>
          <button
            onClick={loadData}
            className="p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
            disabled={loading}
          >
            <RefreshCw
              size={14}
              className={cn("text-zinc-400", loading && "animate-spin")}
            />
          </button>
        </div>

        {error ? (
          <div className="p-6 text-center">
            <AlertCircle size={24} className="mx-auto text-zinc-600 mb-2" />
            <p className="text-sm text-zinc-500 mb-3">{error}</p>
            <a
              href="https://app.pacifica.fi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Deposit on Pacifica
              <ExternalLink size={14} />
            </a>
          </div>
        ) : account ? (
          <div className="p-4">
            {/* Main stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <StatCard
                icon={<DollarSign size={14} className="text-green-500" />}
                label="Account Equity"
                value={formatUSD(parseFloat(account.account_equity || "0"))}
                color="text-green-500"
              />
              <StatCard
                icon={<Wallet size={14} className="text-blue-500" />}
                label="Balance"
                value={formatUSD(parseFloat(account.balance || "0"))}
                color="text-blue-500"
              />
              <StatCard
                icon={<ShieldCheck size={14} className="text-purple-500" />}
                label="Margin Used"
                value={formatUSD(parseFloat(account.total_margin_used || "0"))}
                color="text-purple-500"
              />
              <StatCard
                icon={<ArrowUpDown size={14} className="text-cyan-500" />}
                label="Available"
                value={formatUSD(parseFloat(account.available_to_spend || "0"))}
                color="text-cyan-500"
              />
            </div>

            {/* Quick stats row */}
            <div className="flex items-center justify-between px-3 py-2 bg-zinc-800/50 rounded-lg text-xs text-zinc-400">
              <span>Positions: <span className="text-white font-bold">{account.positions_count}</span></span>
              <span>Orders: <span className="text-white font-bold">{account.orders_count}</span></span>
              <span>Maker: <span className="text-white font-mono">{(parseFloat(account.maker_fee || "0") * 100).toFixed(2)}%</span></span>
              <span>Taker: <span className="text-white font-mono">{(parseFloat(account.taker_fee || "0") * 100).toFixed(2)}%</span></span>
            </div>
          </div>
        ) : null}
      </div>

      {/* Positions */}
      {positions.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-800">
            <h3 className="font-semibold">Open Positions</h3>
          </div>
          <div className="divide-y divide-zinc-800/50">
            {positions.map((pos, idx) => {
              const pnl = parseFloat(pos.unrealized_pnl || "0");
              const isProfit = pnl >= 0;
              const isLong = pos.side === "bid" || pos.side === "long";
              return (
                <div key={idx} className="px-4 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold">{pos.symbol}</span>
                      <span
                        className={cn(
                          "text-xs font-bold px-2 py-0.5 rounded",
                          isLong
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        )}
                      >
                        {isLong ? "LONG" : "SHORT"} {pos.leverage}x
                      </span>
                    </div>
                    <span
                      className={cn(
                        "font-bold font-mono",
                        isProfit ? "text-green-500" : "text-red-500"
                      )}
                    >
                      {isProfit ? "+" : ""}
                      {formatUSD(pnl)}
                    </span>
                  </div>
                  <div className="flex gap-4 text-xs text-zinc-500">
                    <span>Size: {parseFloat(pos.size).toFixed(4)}</span>
                    <span>Entry: ${parseFloat(pos.entry_price).toLocaleString()}</span>
                    <span>Mark: ${parseFloat(pos.mark_price).toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="flex gap-3">
        <a
          href="https://app.pacifica.fi"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors"
        >
          Deposit / Withdraw
          <ExternalLink size={12} />
        </a>
        <a
          href="https://test-app.pacifica.fi/faucet"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors"
        >
          Get Testnet Token
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-zinc-800/50 rounded-lg p-3">
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <span className="text-xs text-zinc-500">{label}</span>
      </div>
      <div className={cn("text-lg font-bold", color)}>{value}</div>
    </div>
  );
}
