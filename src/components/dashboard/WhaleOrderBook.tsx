"use client";

import { useWhaleData, WhaleAlertData } from "@/contexts/WhaleWebSocketContext";
import { formatUSD, formatNumber, formatTimeAgo, cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Wifi, WifiOff } from "lucide-react";
import { useMemo } from "react";

interface WhaleOrderBookProps {
  symbolFilter?: string;
}

export function WhaleOrderBook({ symbolFilter }: WhaleOrderBookProps) {
  const { alerts: allAlerts, isConnected } = useWhaleData();

  const alerts = symbolFilter
    ? allAlerts.filter((a) => a.symbol === symbolFilter)
    : allAlerts;

  const { buyAlerts, sellAlerts } = useMemo(() => {
    const buys: WhaleAlertData[] = [];
    const sells: WhaleAlertData[] = [];

    alerts.forEach((alert) => {
      const isBuy = alert.side === "buy" || alert.side === "bid";
      if (isBuy) {
        buys.push(alert);
      } else {
        sells.push(alert);
      }
    });

    return {
      buyAlerts: buys.slice(0, 15),
      sellAlerts: sells.slice(0, 15),
    };
  }, [alerts]);

  const buyTotal = buyAlerts.reduce((sum, a) => sum + a.usd_value, 0);
  const sellTotal = sellAlerts.reduce((sum, a) => sum + a.usd_value, 0);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
        <h2 className="text-lg font-semibold">Whale Order Flow</h2>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <Wifi size={16} className="text-green-500" />
              <span className="text-xs text-green-500">Live</span>
            </>
          ) : (
            <>
              <WifiOff size={16} className="text-red-500" />
              <span className="text-xs text-red-500">Offline</span>
            </>
          )}
        </div>
      </div>

      {/* Order Book Grid */}
      <div className="grid grid-cols-2 divide-x divide-zinc-800">
        {/* Buy Side */}
        <div>
          <div className="px-4 py-3 bg-green-500/5 border-b border-zinc-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowUpRight size={16} className="text-green-500" />
                <span className="text-sm font-medium text-green-500">BUYS</span>
              </div>
              <span className="text-xs text-green-400">{formatUSD(buyTotal)}</span>
            </div>
          </div>
          <div className="divide-y divide-zinc-800/50 max-h-[400px] overflow-y-auto">
            {buyAlerts.length === 0 ? (
              <div className="px-4 py-8 text-center text-zinc-500 text-sm">
                No buy whales yet
              </div>
            ) : (
              buyAlerts.map((alert, idx) => (
                <OrderRow key={`buy-${idx}`} alert={alert} side="buy" />
              ))
            )}
          </div>
        </div>

        {/* Sell Side */}
        <div>
          <div className="px-4 py-3 bg-red-500/5 border-b border-zinc-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowDownRight size={16} className="text-red-500" />
                <span className="text-sm font-medium text-red-500">SELLS</span>
              </div>
              <span className="text-xs text-red-400">{formatUSD(sellTotal)}</span>
            </div>
          </div>
          <div className="divide-y divide-zinc-800/50 max-h-[400px] overflow-y-auto">
            {sellAlerts.length === 0 ? (
              <div className="px-4 py-8 text-center text-zinc-500 text-sm">
                No sell whales yet
              </div>
            ) : (
              sellAlerts.map((alert, idx) => (
                <OrderRow key={`sell-${idx}`} alert={alert} side="sell" />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="px-4 py-3 bg-zinc-950 border-t border-zinc-800">
        <div className="flex items-center gap-2">
          <div
            className="h-2 rounded-full bg-green-500"
            style={{
              width: `${buyTotal + sellTotal > 0 ? (buyTotal / (buyTotal + sellTotal)) * 100 : 50}%`,
            }}
          />
          <div
            className="h-2 rounded-full bg-red-500 flex-1"
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-zinc-500">
          <span>Buy Pressure: {buyTotal + sellTotal > 0 ? ((buyTotal / (buyTotal + sellTotal)) * 100).toFixed(1) : 50}%</span>
          <span>Sell Pressure: {buyTotal + sellTotal > 0 ? ((sellTotal / (buyTotal + sellTotal)) * 100).toFixed(1) : 50}%</span>
        </div>
      </div>
    </div>
  );
}

function OrderRow({ alert, side }: { alert: WhaleAlertData; side: "buy" | "sell" }) {
  const isBuy = side === "buy";

  return (
    <div className={cn(
      "px-4 py-3 hover:bg-zinc-800/30 transition-colors",
    )}>
      <div className="flex justify-between items-start">
        <div>
          <span className="font-mono font-bold text-sm">{alert.symbol}</span>
          <p className="text-lg font-bold mt-0.5" style={{ color: isBuy ? "#22c55e" : "#ef4444" }}>
            {formatUSD(alert.usd_value)}
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-zinc-500">{formatTimeAgo(alert.timestamp)}</span>
          <p className="text-xs text-zinc-400 mt-1">
            {formatNumber(alert.amount, 4)}
          </p>
        </div>
      </div>
    </div>
  );
}
