"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const PRICE_SYMBOLS = [
  { symbol: "BTC", label: "Bitcoin", color: "#F7931A" },
  { symbol: "ETH", label: "Ethereum", color: "#627EEA" },
  { symbol: "SOL", label: "Solana", color: "#9945FF" },
];

interface PriceData {
  symbol: string;
  price: number;
  prevPrice: number | null;
  fundingRate: number | null;
}

async function fetchLastPrice(symbol: string): Promise<number | null> {
  try {
    const res = await fetch(
      `https://api.pacifica.fi/api/v1/trades?symbol=${symbol}&limit=1`,
      { cache: "no-store" }
    );
    const json = await res.json();
    const trades: { price: string }[] = json?.data ?? [];
    if (trades.length === 0) return null;
    return parseFloat(trades[0].price);
  } catch {
    return null;
  }
}

export function PriceTicker() {
  const [prices, setPrices] = useState<PriceData[]>(
    PRICE_SYMBOLS.map((s) => ({ symbol: s.symbol, price: 0, prevPrice: null, fundingRate: null }))
  );
  const [loading, setLoading] = useState(true);

  async function refresh() {
    const [btcPrice, ethPrice, solPrice, infoRes] = await Promise.all([
      fetchLastPrice("BTC"),
      fetchLastPrice("ETH"),
      fetchLastPrice("SOL"),
      fetch("https://api.pacifica.fi/api/v1/info", { cache: "no-store" })
        .then((r) => r.json())
        .catch(() => ({ data: [] })),
    ]);

    const markets: { symbol: string; funding_rate: string }[] = infoRes?.data ?? [];
    const getFunding = (sym: string) => {
      const m = markets.find((x) => x.symbol === sym);
      return m ? parseFloat(m.funding_rate) : null;
    };

    const newPrices: Record<string, number | null> = {
      BTC: btcPrice,
      ETH: ethPrice,
      SOL: solPrice,
    };

    setPrices((prev) =>
      PRICE_SYMBOLS.map(({ symbol }) => ({
        symbol,
        price: newPrices[symbol] ?? prev.find((p) => p.symbol === symbol)?.price ?? 0,
        prevPrice: prev.find((p) => p.symbol === symbol)?.price ?? null,
        fundingRate: getFunding(symbol),
      }))
    );
    setLoading(false);
  }

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 30_000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function formatPrice(symbol: string, price: number) {
    if (price === 0) return "—";
    if (symbol === "BTC")
      return `$${price.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
    return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  function getPriceDir(p: PriceData) {
    if (p.prevPrice === null || p.price === p.prevPrice) return "neutral";
    return p.price > p.prevPrice ? "up" : "down";
  }

  return (
    <div className="w-full ">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
        {PRICE_SYMBOLS.map(({ symbol, label, color }, i) => {
          const data = prices.find((p) => p.symbol === symbol);
          const dir = data ? getPriceDir(data) : "neutral";
          const fundingPct =
            data?.fundingRate != null
              ? (data.fundingRate * 100).toFixed(4)
              : null;
          const fundingPositive =
            data?.fundingRate != null && data.fundingRate >= 0;

          return (
            <motion.div
              key={symbol}
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              {/* Symbol dot */}
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{
                  backgroundColor: color,
                  boxShadow: `0 0 6px ${color}88`,
                }}
              />

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-zinc-500 font-medium">{label}</span>
                  <span className="text-xs text-zinc-700">·</span>
                  <span className="text-xs font-mono text-zinc-600">{symbol}/USD</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {loading ? (
                    <div className="h-4 w-20 bg-zinc-800 rounded animate-pulse" />
                  ) : (
                    <motion.span
                      key={data?.price}
                      className={`text-sm font-bold font-mono ${
                        dir === "up"
                          ? "text-green-400"
                          : dir === "down"
                          ? "text-red-400"
                          : "text-white"
                      }`}
                      initial={{ opacity: 0.6 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {formatPrice(symbol, data?.price ?? 0)}
                    </motion.span>
                  )}
                  {!loading && (
                    <span>
                      {dir === "up" ? (
                        <TrendingUp size={12} className="text-green-500" />
                      ) : dir === "down" ? (
                        <TrendingDown size={12} className="text-red-500" />
                      ) : (
                        <Minus size={12} className="text-zinc-600" />
                      )}
                    </span>
                  )}
                  {fundingPct !== null && (
                    <span
                      className={`text-xs font-mono ${
                        fundingPositive ? "text-red-400" : "text-green-400"
                      }`}
                    >
                      FR: {fundingPositive ? "+" : ""}{fundingPct}%
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

      </div>
    </div>
  );
}
