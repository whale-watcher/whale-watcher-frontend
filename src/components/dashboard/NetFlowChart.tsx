"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { fetchWhaleStats, WhaleStats } from "@/lib/api";
import { formatUSD } from "@/lib/utils";

interface NetFlowChartProps {
  symbolFilter?: string;
}

export function NetFlowChart({ symbolFilter }: NetFlowChartProps) {
  const [stats, setStats] = useState<WhaleStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await fetchWhaleStats(symbolFilter, 24);
        setStats(data);
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
    const interval = setInterval(loadStats, 30000); // Refresh every 30s

    return () => clearInterval(interval);
  }, [symbolFilter]);

  if (loading) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 h-64 flex items-center justify-center">
        <div className="text-zinc-500">Loading...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 h-64 flex items-center justify-center">
        <div className="text-zinc-500">No data available</div>
      </div>
    );
  }

  const chartData = [
    { name: "Buy Volume", value: stats.buy_volume_usd, fill: "#22c55e" },
    { name: "Sell Volume", value: stats.sell_volume_usd, fill: "#ef4444" },
  ];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          Volume Distribution (24h){symbolFilter && <span className="text-blue-500 ml-2">• {symbolFilter}</span>}
        </h2>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-zinc-400">Buy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-zinc-400">Sell</span>
          </div>
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical">
            <XAxis
              type="number"
              tickFormatter={(val) => `$${(val / 1000000).toFixed(1)}M`}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#71717a", fontSize: 12 }}
            />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#71717a", fontSize: 12 }}
              width={90}
            />
            <Tooltip
              formatter={(value) => formatUSD(Number(value))}
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #27272a",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#fff" }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4 border-t border-zinc-800">
        <div className="flex justify-between items-center">
          <span className="text-sm text-zinc-400">Net Flow</span>
          <span
            className={`text-lg font-bold ${
              stats.net_flow_usd >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {stats.net_flow_usd >= 0 ? "+" : ""}
            {formatUSD(stats.net_flow_usd)}
          </span>
        </div>
      </div>
    </div>
  );
}
