"use client";

import { useEffect, useState } from "react";
import { fetchSignals, TradeSignal } from "@/lib/api";
import { formatUSD, cn } from "@/lib/utils";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  Gauge,
  Activity,
  Zap,
} from "lucide-react";

const PACIFICA_TRADE_URL = "https://test-app.pacifica.fi/trade";

interface SmartTradeProps {
  symbolFilter?: string;
}

export function SmartTrade({ symbolFilter }: SmartTradeProps) {
  const [signals, setSignals] = useState<Record<string, TradeSignal>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadSignals = async () => {
    try {
      const data = await fetchSignals();
      if (data && typeof data === "object" && !("direction" in data)) {
        setSignals(data as Record<string, TradeSignal>);
      }
    } catch (error) {
      console.error("Failed to load signals:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSignals();
    const interval = setInterval(loadSignals, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadSignals();
  };

  const displaySymbols = symbolFilter
    ? [symbolFilter]
    : ["BTC", "ETH", "SOL"];

  if (loading) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-40 bg-zinc-800 rounded" />
          <div className="h-40 bg-zinc-800 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain size={18} className="text-yellow-500" />
            <h3 className="font-semibold">Smart Trade Signals</h3>
            <span className="px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs rounded-full">
              BETA
            </span>
          </div>
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
            disabled={refreshing}
          >
            <RefreshCw
              size={14}
              className={cn("text-zinc-400", refreshing && "animate-spin")}
            />
          </button>
        </div>

        {/* Signal Cards */}
        <div className="p-4 space-y-3">
          {displaySymbols.map((symbol) => {
            const signal = signals[symbol];
            if (!signal) return null;
            return (
              <SignalCard key={symbol} signal={signal} />
            );
          })}
        </div>

        {/* Disclaimer */}
        <div className="px-5 py-3 border-t border-zinc-800 bg-zinc-950 flex items-start gap-2">
          <AlertTriangle size={12} className="text-zinc-600 mt-0.5 shrink-0" />
          <p className="text-xs text-zinc-600">
            Signal-based suggestions only. Not financial advice. Always do your
            own research before trading.
          </p>
        </div>
      </div>
    </div>
  );
}

function SignalCard({ signal }: { signal: TradeSignal }) {
  const isLong = signal.direction === "LONG";
  const isShort = signal.direction === "SHORT";
  const isHold = signal.direction === "HOLD";

  const dirColor = isLong
    ? "text-green-400"
    : isShort
    ? "text-red-400"
    : "text-zinc-400";

  const dirBg = isLong
    ? "bg-green-500/10 border-green-500/20"
    : isShort
    ? "bg-red-500/10 border-red-500/20"
    : "bg-zinc-800/50 border-zinc-700";

  const DirIcon = isLong ? TrendingUp : isShort ? TrendingDown : Minus;

  return (
    <div className={cn("rounded-xl border p-4", dirBg)}>
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="font-mono font-bold text-lg text-white">
            {signal.symbol}
          </span>
          <div className={cn("flex items-center gap-1.5 px-3 py-1 rounded-full border", dirBg)}>
            <DirIcon size={14} className={dirColor} />
            <span className={cn("font-bold text-sm", dirColor)}>
              {signal.direction}
            </span>
          </div>
        </div>

        {/* Confidence */}
        <div className="text-right">
          <div className={cn("text-2xl font-bold", dirColor)}>
            {signal.confidence.toFixed(0)}%
          </div>
          <div className="text-xs text-zinc-500">confidence</div>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden mb-4">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            isLong ? "bg-green-500" : isShort ? "bg-red-500" : "bg-zinc-600"
          )}
          style={{ width: `${signal.confidence}%` }}
        />
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-black/30 rounded-lg px-3 py-2">
          <div className="flex items-center gap-1 mb-1">
            <Gauge size={11} className="text-purple-400" />
            <span className="text-xs text-zinc-500">Imbalance</span>
          </div>
          <span className={cn(
            "text-sm font-bold font-mono",
            signal.imbalance_pct > 0 ? "text-green-400" : signal.imbalance_pct < 0 ? "text-red-400" : "text-zinc-400"
          )}>
            {signal.imbalance_pct > 0 ? "+" : ""}{signal.imbalance_pct.toFixed(1)}%
          </span>
        </div>
        <div className="bg-black/30 rounded-lg px-3 py-2">
          <div className="flex items-center gap-1 mb-1">
            <Activity size={11} className="text-blue-400" />
            <span className="text-xs text-zinc-500">Whale Buy</span>
          </div>
          <span className={cn(
            "text-sm font-bold font-mono",
            signal.whale_buy_pct > 55 ? "text-green-400" : signal.whale_buy_pct < 45 ? "text-red-400" : "text-zinc-400"
          )}>
            {signal.whale_buy_pct.toFixed(0)}%
          </span>
        </div>
        <div className="bg-black/30 rounded-lg px-3 py-2">
          <div className="flex items-center gap-1 mb-1">
            <Zap size={11} className="text-yellow-400" />
            <span className="text-xs text-zinc-500">Whales</span>
          </div>
          <span className="text-sm font-bold font-mono text-white">
            {signal.whale_count}
          </span>
        </div>
      </div>

      {/* Reasons */}
      <div className="space-y-1 mb-4">
        {signal.reasons.map((reason, i) => (
          <div key={i} className="flex items-start gap-2 text-xs text-zinc-400">
            <span className="text-zinc-600 mt-0.5">•</span>
            {reason}
          </div>
        ))}
      </div>

      {/* Action buttons */}
      {!isHold && (
        <div className="flex gap-2">
          <a
            href={`${PACIFICA_TRADE_URL}/${signal.symbol}`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all",
              isLong
                ? "bg-green-600 hover:bg-green-500 text-white"
                : "bg-red-600 hover:bg-red-500 text-white"
            )}
          >
            {isLong ? (
              <>
                <TrendingUp size={14} />
                Open Long on Pacifica
              </>
            ) : (
              <>
                <TrendingDown size={14} />
                Open Short on Pacifica
              </>
            )}
            <ExternalLink size={12} />
          </a>
        </div>
      )}
    </div>
  );
}
