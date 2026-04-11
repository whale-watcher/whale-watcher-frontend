"use client";

import { useWhaleData, ImbalanceData } from "@/contexts/WhaleWebSocketContext";
import { formatUSD, cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Activity, Gauge } from "lucide-react";

interface OrderbookImbalanceProps {
  symbolFilter?: string;
}

export function OrderbookImbalance({ symbolFilter }: OrderbookImbalanceProps) {
  const { imbalances, isConnected } = useWhaleData();

  // Get data based on filter
  const getData = () => {
    if (symbolFilter && imbalances.symbols[symbolFilter]) {
      const data = imbalances.symbols[symbolFilter];
      return {
        ratio: data.imbalance_ratio,
        pct: data.imbalance_pct,
        bidVolume: data.bid_volume,
        askVolume: data.ask_volume,
        spread: data.spread_pct,
        bestBid: data.best_bid,
        bestAsk: data.best_ask,
        symbol: symbolFilter
      };
    }
    return {
      ratio: imbalances.overall_imbalance_ratio,
      pct: imbalances.overall_imbalance_pct,
      bidVolume: imbalances.total_bid_volume,
      askVolume: imbalances.total_ask_volume,
      spread: 0,
      bestBid: 0,
      bestAsk: 0,
      symbol: "ALL"
    };
  };

  const data = getData();
  const hasData = data.bidVolume > 0 || data.askVolume > 0;

  // Determine market bias
  const getBias = () => {
    if (data.pct > 20) return { label: "STRONG BUY", color: "text-green-400", bg: "bg-green-500" };
    if (data.pct > 5) return { label: "BUY PRESSURE", color: "text-green-500", bg: "bg-green-500" };
    if (data.pct < -20) return { label: "STRONG SELL", color: "text-red-400", bg: "bg-red-500" };
    if (data.pct < -5) return { label: "SELL PRESSURE", color: "text-red-500", bg: "bg-red-500" };
    return { label: "NEUTRAL", color: "text-zinc-400", bg: "bg-zinc-500" };
  };

  const bias = getBias();

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gauge size={18} className="text-purple-500" />
          <h3 className="font-semibold">Orderbook Imbalance</h3>
          {symbolFilter && (
            <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full font-mono">
              {symbolFilter}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
              </span>
              <span className="text-xs text-purple-400">LIVE</span>
            </span>
          ) : (
            <span className="text-xs text-zinc-500">Connecting...</span>
          )}
        </div>
      </div>

      <div className="p-5">
        {!hasData ? (
          <div className="text-center py-8 text-zinc-500">
            <Activity className="mx-auto mb-2 opacity-50" size={32} />
            <p>Waiting for orderbook data...</p>
          </div>
        ) : (
          <>
            {/* Main Gauge */}
            <div className="text-center mb-6">
              <div className={cn("text-3xl font-bold mb-1", bias.color)}>
                {bias.label}
              </div>
              <div className="text-sm text-zinc-500">
                {data.pct >= 0 ? "+" : ""}{data.pct.toFixed(1)}% imbalance
              </div>
            </div>

            {/* Visual Bar */}
            <div className="relative mb-6">
              <div className="flex h-8 rounded-lg overflow-hidden bg-zinc-800">
                <div
                  className="bg-gradient-to-r from-green-600 to-green-400 transition-all duration-300 flex items-center justify-end pr-2"
                  style={{ width: `${data.ratio * 100}%` }}
                >
                  {data.ratio > 0.3 && (
                    <span className="text-xs font-bold text-white/90">
                      {(data.ratio * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
                <div
                  className="bg-gradient-to-r from-red-400 to-red-600 flex-1 flex items-center pl-2"
                >
                  {data.ratio < 0.7 && (
                    <span className="text-xs font-bold text-white/90">
                      {((1 - data.ratio) * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>
              
              {/* Center marker */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full flex items-center">
                <div className="w-0.5 h-10 bg-white/30 rounded-full" />
              </div>
            </div>

            {/* Volume Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp size={14} className="text-green-500" />
                  <span className="text-xs text-green-400">BID VOLUME</span>
                </div>
                <div className="text-lg font-bold text-green-500">
                  {formatUSD(data.bidVolume)}
                </div>
              </div>
              <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingDown size={14} className="text-red-500" />
                  <span className="text-xs text-red-400">ASK VOLUME</span>
                </div>
                <div className="text-lg font-bold text-red-500">
                  {formatUSD(data.askVolume)}
                </div>
              </div>
            </div>

            {/* Symbol Details */}
            {Object.keys(imbalances.symbols).length > 0 && !symbolFilter && (
              <div className="border-t border-zinc-800 pt-4 mt-4">
                <h4 className="text-xs text-zinc-500 uppercase tracking-wider mb-3">By Symbol</h4>
                <div className="space-y-2">
                  {Object.entries(imbalances.symbols).map(([symbol, data]) => (
                    <SymbolImbalanceRow key={symbol} symbol={symbol} data={data} />
                  ))}
                </div>
              </div>
            )}

            {/* Spread Info (if single symbol) */}
            {symbolFilter && data.spread > 0 && (
              <div className="border-t border-zinc-800 pt-4 mt-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xs text-zinc-500 mb-1">Best Bid</div>
                    <div className="font-mono text-green-500">${data.bestBid.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 mb-1">Spread</div>
                    <div className="font-mono text-zinc-400">{data.spread.toFixed(3)}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 mb-1">Best Ask</div>
                    <div className="font-mono text-red-500">${data.bestAsk.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function SymbolImbalanceRow({ symbol, data }: { symbol: string; data: ImbalanceData }) {
  const pct = data.imbalance_pct;
  const ratio = data.imbalance_ratio;
  const isBullish = pct > 0;

  return (
    <div className="flex items-center gap-3 group">
      <span className="font-mono text-sm w-12 font-bold">{symbol}</span>
      <div className="flex-1 h-3 bg-zinc-800 rounded-full overflow-hidden flex">
        {/* Bid (green) side */}
        <div
          className="bg-gradient-to-r from-green-600 to-green-500 transition-all duration-500"
          style={{ width: `${ratio * 100}%` }}
        />
        {/* Ask (red) side */}
        <div
          className="bg-gradient-to-r from-red-500 to-red-600 flex-1"
        />
      </div>
      <span className={cn(
        "text-xs font-mono w-16 text-right font-bold",
        isBullish ? "text-green-500" : "text-red-500"
      )}>
        {pct >= 0 ? "+" : ""}{pct.toFixed(1)}%
      </span>
    </div>
  );
}
