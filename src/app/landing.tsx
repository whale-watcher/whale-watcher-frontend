"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Activity,
  Gauge,
  Brain,
  Bell,
  Wallet,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Zap,
  ChevronDown,
} from "lucide-react";
import BlurText from "@/components/BlurText";
import ShinyText from "@/components/ShinyText";
import CountUp from "@/components/CountUp";
import { PriceTicker } from "@/components/PriceTicker";

const features = [
  {
    icon: Activity,
    title: "Real-time Whale Feed",
    description:
      "See every large trade the moment it happens on Pacifica. BTC, ETH, SOL — all tracked 24/7.",
    color: "from-green-500/20 to-green-500/0",
    iconColor: "text-green-500",
  },
  {
    icon: Gauge,
    title: "Orderbook Imbalance",
    description:
      "Live bid/ask pressure visualization. Know if the market is leaning bullish or bearish in one glance.",
    color: "from-purple-500/20 to-purple-500/0",
    iconColor: "text-purple-500",
  },
  {
    icon: Brain,
    title: "Smart Trade Signals",
    description:
      "Combined analytics produce a LONG/SHORT/HOLD signal with confidence score. Data-driven suggestions.",
    color: "from-yellow-500/20 to-yellow-500/0",
    iconColor: "text-yellow-500",
  },
  {
    icon: Bell,
    title: "Telegram Alerts",
    description:
      "Set your own threshold — $10k, $50k, $100k or any custom value. Get pinged only when it matters.",
    color: "from-cyan-500/20 to-cyan-500/0",
    iconColor: "text-cyan-500",
  },
  {
    icon: BookOpen,
    title: "Order Flow Board",
    description:
      "Buy vs sell whale flow split side by side. Total pressure bar shows who's dominating.",
    color: "from-blue-500/20 to-blue-500/0",
    iconColor: "text-blue-500",
  },
  {
    icon: Wallet,
    title: "Portfolio Tracking",
    description:
      "Connect your wallet to view Pacifica account equity, positions, and unrealized PnL in real time.",
    color: "from-pink-500/20 to-pink-500/0",
    iconColor: "text-pink-500",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-zinc-800/50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Whale Watcher"
              className="w-9 h-9 rounded-lg"
            />
            <span className="font-bold text-lg">Whale Watcher</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/docs"
              className="text-sm text-zinc-400 hover:text-white transition-colors hidden sm:block"
            >
              Docs
            </Link>
            <a
              href="https://t.me/watcherWallerWhales_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-400 hover:text-white transition-colors hidden sm:block"
            >
              Telegram Bot
            </a>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Open Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-purple-500/8 rounded-full blur-[100px]" />
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-green-500/8 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-8">
              <Zap size={14} />
              <ShinyText
                text="Pacifica Hackathon 2026 · Track 2: Analytics & Data"
                speed={3}
                className="text-sm"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="mb-6">
              <img
                src="/logo.png"
                alt="Whale Watcher"
                className="w-24 h-24 mx-auto rounded-2xl mb-6"
              />
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-2">
              <BlurText
                text="Whale Watcher"
                className="text-white justify-center"
                delay={100}
                animateBy="words"
              />
            </h1>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              <BlurText
                text="+ Orderbook Imbalance"
                className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent justify-center"
                delay={150}
                direction="bottom"
              />
            </h2>
          </motion.div>

          <motion.p
            className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Real-time market intelligence for Pacifica perpetuals. See whale
            moves, read orderbook pressure, and get smart trade signals — before
            everyone else.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link
              href="/dashboard"
              className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all text-lg"
            >
              Launch Dashboard
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-semibold rounded-xl transition-all text-lg"
            >
              Read Docs
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ChevronDown size={24} className="text-zinc-600" />
          </motion.div>
        </div>
      </section>

      {/* Live Dashboard Preview */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs font-medium mb-4">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
              </span>
              Live Dashboard Preview
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              See it in action
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              This is the real dashboard — live data, real signals, updated
              every few seconds.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            {/* Browser chrome */}
            <div className="rounded-2xl overflow-hidden border border-zinc-700/60 shadow-[0_0_80px_rgba(59,130,246,0.08)] bg-zinc-900">
              {/* Title bar */}
              <div className="flex items-center gap-3 px-4 py-3 bg-zinc-800/80 border-b border-zinc-700/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <div className="flex-1 bg-zinc-700/50 rounded-md px-3 py-1 text-xs text-zinc-400 font-mono flex items-center gap-2">
                  <span className="text-green-400">🔒</span>
                  whalewatcher.app/dashboard
                  <span className="ml-auto flex items-center gap-1 text-green-400 text-[10px]">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                    </span>
                    LIVE
                  </span>
                </div>
              </div>

              {/* iframe wrapper */}
              <div className="relative w-full" style={{ height: "600px" }}>
                <iframe
                  src="/dashboard"
                  className="w-full h-full border-0"
                  style={{
                    transform: "scale(0.85)",
                    transformOrigin: "top left",
                    width: "117.6%",
                    height: "117.6%",
                    pointerEvents: "none",
                  }}
                  scrolling="no"
                  title="Whale Watcher Dashboard Preview"
                />

                {/* Bottom gradient fade */}
                <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-zinc-900 via-zinc-900/80 to-transparent pointer-events-none" />

                {/* CTA overlay */}
                <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end pb-8 gap-4 pointer-events-none">
                  <p className="text-zinc-400 text-sm">
                    Full interactive experience in the dashboard
                  </p>
                  <Link
                    href="/dashboard"
                    className="pointer-events-auto group inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20"
                  >
                    Open Full Dashboard
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Price Ticker */}
      <PriceTicker />

      {/* Stats */}

      <section className="py-20 border-t border-zinc-800/50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                value: 18,
                suffix: "M+",
                label: "Whale Volume Tracked (24h)",
                prefix: "$",
              },
              {
                value: 800,
                suffix: "+",
                label: "Whale Alerts Detected",
                prefix: "",
              },
              { value: 3, suffix: "", label: "Markets Live", prefix: "" },
              {
                value: 250,
                suffix: "ms",
                label: "Orderbook Update Speed",
                prefix: "",
              },
            ].map(({ value, suffix, label, prefix }) => (
              <motion.div
                key={label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  {prefix}
                  <CountUp
                    to={value}
                    separator=","
                    duration={2}
                    className="font-bold"
                  />
                  {suffix}
                </div>
                <div className="text-sm text-zinc-500">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need to trade smarter
            </h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              From whale detection to smart signals — all powered by live
              Pacifica data.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="group relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-b ${feature.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity`}
                />
                <div className="relative">
                  <div
                    className={`w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center mb-4 ${feature.iconColor}`}
                  >
                    <feature.icon size={20} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              From data to decision in seconds
            </h2>
          </motion.div>

          <div className="space-y-0">
            {[
              {
                step: "01",
                title: "We stream live data",
                desc: "Trades and orderbook from Pacifica WebSocket, processed in real time.",
              },
              {
                step: "02",
                title: "We analyze the signals",
                desc: "Whale detection + orderbook imbalance → combined into a confidence-scored signal.",
              },
              {
                step: "03",
                title: "You act on it",
                desc: "See the signal on your dashboard or get a Telegram ping. One click to execute on Pacifica.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                className="flex gap-6 py-8 border-b border-zinc-800/50"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <span className="text-4xl font-bold text-zinc-800 shrink-0">
                  {item.step}
                </span>
                <div>
                  <h3 className="font-semibold text-xl mb-1">{item.title}</h3>
                  <p className="text-zinc-400">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-zinc-800/50">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="" className="w-5 h-5 rounded" />
            <span>Whale Watcher · Pacifica Hackathon 2026</span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <Link href="/docs" className="hover:text-white transition-colors">
              Docs
            </Link>
            <a
              href="https://pacifica.fi"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Pacifica ↗
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
