"use client";

import { useEffect, useState, useMemo } from "react";
import { fetchRecentWhales, fetchWhaleStats, WhaleAlert, WhaleStats } from "@/lib/api";
import { formatUSD, formatNumber } from "@/lib/utils";
import { 
  TrendingUp, 
  TrendingDown, 
  Trophy, 
  BarChart3,
  PieChart,
  Flame
} from "lucide-react";

interface WhaleAnalyticsProps {
  symbolFilter?: string;
}

export function WhaleAnalytics({ symbolFilter }: WhaleAnalyticsProps) {
  const [alerts, setAlerts] = useState<WhaleAlert[]>([]);
  const [stats, setStats] = useState<WhaleStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [alertsData, statsData] = await Promise.all([
          fetchRecentWhales(symbolFilter, 100),
          fetchWhaleStats(symbolFilter, 24),
        ]);
        setAlerts(alertsData);
        setStats(statsData);
      } catch (error) {
        console.error("Failed to load analytics:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [symbolFilter]);

  const analytics = useMemo(() => {
    if (alerts.length === 0) return null;

    // Top buys
    const buys = alerts.filter((a) => a.side === "buy");
    const sells = alerts.filter((a) => a.side === "sell");

    const topBuys = [...buys].sort((a, b) => b.usd_value - a.usd_value).slice(0, 5);
    const topSells = [...sells].sort((a, b) => b.usd_value - a.usd_value).slice(0, 5);

    // Volume by symbol
    const volumeBySymbol: Record<string, { buy: number; sell: number }> = {};
    alerts.forEach((alert) => {
      if (!volumeBySymbol[alert.symbol]) {
        volumeBySymbol[alert.symbol] = { buy: 0, sell: 0 };
      }
      if (alert.side === "buy") {
        volumeBySymbol[alert.symbol].buy += alert.usd_value;
      } else {
        volumeBySymbol[alert.symbol].sell += alert.usd_value;
      }
    });

    const symbolStats = Object.entries(volumeBySymbol)
      .map(([symbol, data]) => ({
        symbol,
        buyVolume: data.buy,
        sellVolume: data.sell,
        totalVolume: data.buy + data.sell,
        netFlow: data.buy - data.sell,
      }))
      .sort((a, b) => b.totalVolume - a.totalVolume);

    // Hourly distribution
    const hourlyVolume: Record<number, number> = {};
    alerts.forEach((alert) => {
      const hour = new Date(alert.detected_at).getHours();
      hourlyVolume[hour] = (hourlyVolume[hour] || 0) + alert.usd_value;
    });

    return {
      topBuys,
      topSells,
      symbolStats,
      hourlyVolume,
      totalBuyVolume: buys.reduce((sum, a) => sum + a.usd_value, 0),
      totalSellVolume: sells.reduce((sum, a) => sum + a.usd_value, 0),
    };
  }, [alerts]);

  if (loading) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 bg-zinc-800 rounded" />
          <div className="h-32 bg-zinc-800 rounded" />
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center text-zinc-500">
        No analytics data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Symbol Breakdown */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center gap-2">
          <PieChart size={18} className="text-blue-500" />
          <h3 className="font-semibold">Volume by Symbol</h3>
        </div>
        <div className="p-4 space-y-3">
          {analytics.symbolStats.map((item) => (
            <div key={item.symbol} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold">{item.symbol}</span>
                <span className="text-sm text-zinc-400">{formatUSD(item.totalVolume)}</span>
              </div>
              <div className="flex h-2 rounded-full overflow-hidden bg-zinc-800">
                <div
                  className="bg-green-500"
                  style={{
                    width: `${item.totalVolume > 0 ? (item.buyVolume / item.totalVolume) * 100 : 0}%`,
                  }}
                />
                <div
                  className="bg-red-500"
                  style={{
                    width: `${item.totalVolume > 0 ? (item.sellVolume / item.totalVolume) * 100 : 0}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-green-500">Buy: {formatUSD(item.buyVolume)}</span>
                <span className={item.netFlow >= 0 ? "text-green-400" : "text-red-400"}>
                  Net: {item.netFlow >= 0 ? "+" : ""}{formatUSD(item.netFlow)}
                </span>
                <span className="text-red-500">Sell: {formatUSD(item.sellVolume)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Trades Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Buys */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-800 bg-green-500/5 flex items-center gap-2">
            <Trophy size={16} className="text-green-500" />
            <h3 className="text-sm font-semibold text-green-500">Top Buys</h3>
          </div>
          <div className="divide-y divide-zinc-800/50">
            {analytics.topBuys.length === 0 ? (
              <div className="p-4 text-center text-zinc-500 text-sm">No buys yet</div>
            ) : (
              analytics.topBuys.map((alert, idx) => (
                <div key={alert.id} className="px-4 py-3 flex items-center gap-3">
                  <span className="text-lg font-bold text-zinc-600">#{idx + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-mono text-sm">{alert.symbol}</span>
                      <span className="text-green-500 font-bold">{formatUSD(alert.usd_value)}</span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {formatNumber(alert.amount, 4)} @ ${formatNumber(alert.price, 2)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Sells */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-800 bg-red-500/5 flex items-center gap-2">
            <Trophy size={16} className="text-red-500" />
            <h3 className="text-sm font-semibold text-red-500">Top Sells</h3>
          </div>
          <div className="divide-y divide-zinc-800/50">
            {analytics.topSells.length === 0 ? (
              <div className="p-4 text-center text-zinc-500 text-sm">No sells yet</div>
            ) : (
              analytics.topSells.map((alert, idx) => (
                <div key={alert.id} className="px-4 py-3 flex items-center gap-3">
                  <span className="text-lg font-bold text-zinc-600">#{idx + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-mono text-sm">{alert.symbol}</span>
                      <span className="text-red-500 font-bold">{formatUSD(alert.usd_value)}</span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {formatNumber(alert.amount, 4)} @ ${formatNumber(alert.price, 2)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Market Sentiment */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center gap-2">
          <Flame size={18} className="text-orange-500" />
          <h3 className="font-semibold">Market Sentiment</h3>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-500">
                {analytics.totalBuyVolume + analytics.totalSellVolume > 0
                  ? ((analytics.totalBuyVolume / (analytics.totalBuyVolume + analytics.totalSellVolume)) * 100).toFixed(1)
                  : 50}%
              </p>
              <p className="text-xs text-zinc-500 mt-1">Buy Dominance</p>
            </div>
            <div>
              <p className={`text-2xl font-bold ${
                analytics.totalBuyVolume - analytics.totalSellVolume >= 0 ? "text-green-500" : "text-red-500"
              }`}>
                {analytics.totalBuyVolume - analytics.totalSellVolume >= 0 ? "BULLISH" : "BEARISH"}
              </p>
              <p className="text-xs text-zinc-500 mt-1">Whale Signal</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-500">
                {analytics.totalBuyVolume + analytics.totalSellVolume > 0
                  ? ((analytics.totalSellVolume / (analytics.totalBuyVolume + analytics.totalSellVolume)) * 100).toFixed(1)
                  : 50}%
              </p>
              <p className="text-xs text-zinc-500 mt-1">Sell Dominance</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex h-4 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-600 to-green-400 transition-all duration-500"
                style={{
                  width: `${
                    analytics.totalBuyVolume + analytics.totalSellVolume > 0
                      ? (analytics.totalBuyVolume / (analytics.totalBuyVolume + analytics.totalSellVolume)) * 100
                      : 50
                  }%`,
                }}
              />
              <div
                className="bg-gradient-to-r from-red-400 to-red-600 flex-1"
              />
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-green-500">{formatUSD(analytics.totalBuyVolume)}</span>
              <span className="text-red-500">{formatUSD(analytics.totalSellVolume)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
