"use client";

import { useWhaleData, WhaleAlertData } from "@/contexts/WhaleWebSocketContext";
import { formatUSD, formatNumber, formatTimeAgo, cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, WifiOff, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

interface WhaleActivityFeedProps {
  symbolFilter?: string;
}

export function WhaleActivityFeed({ symbolFilter }: WhaleActivityFeedProps) {
  const { alerts: allAlerts, isConnected, lastUpdate } = useWhaleData();
  const [isNewData, setIsNewData] = useState(false);
  
  // Flash effect when new data arrives
  useEffect(() => {
    if (lastUpdate) {
      setIsNewData(true);
      const timer = setTimeout(() => setIsNewData(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [lastUpdate]);
  
  const alerts = symbolFilter
    ? allAlerts.filter((a) => a.symbol === symbolFilter)
    : allAlerts;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Live Whale Activity</h2>
          {symbolFilter && (
            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full font-mono">
              {symbolFilter}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* Live indicator with pulse */}
          {isConnected ? (
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className={cn(
                  "absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75",
                  isNewData && "animate-ping"
                )} />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-xs text-green-500 font-medium">LIVE</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <WifiOff size={14} className="text-red-500" />
              <span className="text-xs text-red-500">Reconnecting...</span>
              <RefreshCw size={12} className="text-red-500 animate-spin" />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-zinc-500">
            <p>Waiting for whale activity...</p>
            <p className="text-sm mt-1">Large trades will appear here</p>
          </div>
        ) : (
          alerts.map((alert, index) => (
            <WhaleAlertCard key={`${alert.timestamp}-${index}`} alert={alert} />
          ))
        )}
      </div>
    </div>
  );
}

function WhaleAlertCard({ alert }: { alert: WhaleAlertData }) {
  const isBuy = alert.side === "buy" || alert.side === "bid";

  return (
    <div
      className={cn(
        "p-4 rounded-lg border transition-all",
        isBuy
          ? "border-green-500/20 bg-green-500/5 hover:bg-green-500/10"
          : "border-red-500/20 bg-red-500/5 hover:bg-red-500/10"
      )}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "p-1.5 rounded-full",
              isBuy ? "bg-green-500/20" : "bg-red-500/20"
            )}
          >
            {isBuy ? (
              <ArrowUpRight size={14} className="text-green-500" />
            ) : (
              <ArrowDownRight size={14} className="text-red-500" />
            )}
          </div>
          <div>
            <span className="font-mono font-bold text-white">
              {alert.symbol}
            </span>
            <span
              className={cn(
                "ml-2 text-sm font-medium",
                isBuy ? "text-green-500" : "text-red-500"
              )}
            >
              {isBuy ? "BUY" : "SELL"}
            </span>
          </div>
        </div>
        <span className="text-zinc-500 text-xs">
          {formatTimeAgo(alert.timestamp)}
        </span>
      </div>

      <div className="mt-3 flex justify-between items-end">
        <div>
          <p className="text-xl font-bold text-white">
            {formatUSD(alert.usd_value)}
          </p>
          <p className="text-xs text-zinc-500">
            {formatNumber(alert.amount, 4)} @ ${formatNumber(alert.price, 2)}
          </p>
        </div>
      </div>
    </div>
  );
}
