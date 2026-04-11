"use client";

import { useEffect, useState } from "react";
import {
  StatsCard,
  WhaleActivityFeed,
  NetFlowChart,
  WhaleOrderBook,
  WhaleAnalytics,
  OrderbookImbalance,
} from "@/components/dashboard";
import { fetchWhaleStats, WhaleStats } from "@/lib/api";
import { formatUSD } from "@/lib/utils";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Zap,
  LayoutGrid,
  BarChart3,
  BookOpen,
} from "lucide-react";
import { ConnectWallet } from "@/components/ConnectWallet";
import { cn } from "@/lib/utils";

type TabType = "overview" | "orderbook" | "analytics";
type SymbolFilter = "ALL" | "BTC" | "ETH" | "SOL";

const SYMBOLS: SymbolFilter[] = ["ALL", "BTC", "ETH", "SOL"];

export function Dashboard() {
  const [stats, setStats] = useState<WhaleStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [selectedSymbol, setSelectedSymbol] = useState<SymbolFilter>("ALL");

  useEffect(() => {
    async function loadStats() {
      try {
        const symbol = selectedSymbol === "ALL" ? undefined : selectedSymbol;
        const data = await fetchWhaleStats(symbol, 24);
        setStats(data);
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, [selectedSymbol]);

  const tabs = [
    { id: "overview" as TabType, label: "Overview", icon: LayoutGrid },
    { id: "orderbook" as TabType, label: "Order Book", icon: BookOpen },
    { id: "analytics" as TabType, label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Zap className="text-blue-500" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold">Whale Watcher</h1>
              <p className="text-xs text-zinc-500">Powered by Pacifica</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/docs"
              className="text-sm text-zinc-400 hover:text-white transition-colors hidden sm:flex items-center gap-1"
            >
              Docs
            </a>
            <a
              href="https://pacifica.fi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-400 hover:text-white transition-colors hidden sm:block"
            >
              Pacifica
            </a>
            <ConnectWallet />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatsCard
            title="Volume (24h)"
            value={loading ? "..." : formatUSD(stats?.total_volume_usd || 0)}
            icon={DollarSign}
            trend="neutral"
          />
          <StatsCard
            title="Alerts (24h)"
            value={loading ? "..." : String(stats?.total_whale_count || 0)}
            subtitle={`${stats?.buy_count || 0}B / ${stats?.sell_count || 0}S`}
            icon={Activity}
          />
          <StatsCard
            title="Net Flow"
            value={
              loading
                ? "..."
                : `${(stats?.net_flow_usd || 0) >= 0 ? "+" : ""}${formatUSD(
                    stats?.net_flow_usd || 0
                  )}`
            }
            icon={(stats?.net_flow_usd || 0) >= 0 ? TrendingUp : TrendingDown}
            trend={(stats?.net_flow_usd || 0) >= 0 ? "up" : "down"}
          />
          <StatsCard
            title="Largest"
            value={loading ? "..." : formatUSD(stats?.largest_trade_usd || 0)}
            icon={Zap}
            trend="neutral"
          />
        </div>

        {/* Tabs and Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {/* Tabs */}
          <div className="flex gap-1 bg-zinc-900 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:text-white"
                )}
              >
                <tab.icon size={16} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Symbol Filter */}
          <div className="flex gap-1 bg-zinc-900 p-1 rounded-lg">
            {SYMBOLS.map((symbol) => (
              <button
                key={symbol}
                onClick={() => setSelectedSymbol(symbol)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-mono font-medium transition-colors",
                  selectedSymbol === symbol
                    ? "bg-blue-600 text-white"
                    : "text-zinc-400 hover:text-white"
                )}
              >
                {symbol}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <WhaleActivityFeed symbolFilter={selectedSymbol === "ALL" ? undefined : selectedSymbol} />
            </div>
            <div className="space-y-6">
              <OrderbookImbalance symbolFilter={selectedSymbol === "ALL" ? undefined : selectedSymbol} />
              <NetFlowChart symbolFilter={selectedSymbol === "ALL" ? undefined : selectedSymbol} />
            </div>
          </div>
        )}

        {activeTab === "orderbook" && (
          <WhaleOrderBook symbolFilter={selectedSymbol === "ALL" ? undefined : selectedSymbol} />
        )}

        {activeTab === "analytics" && (
          <WhaleAnalytics symbolFilter={selectedSymbol === "ALL" ? undefined : selectedSymbol} />
        )}

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-zinc-800 text-center">
          <p className="text-sm text-zinc-500">
            Built for Pacifica Hackathon 2026 | Track: Analytics & Data
          </p>
        </footer>
      </main>
    </div>
  );
}
