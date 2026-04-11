"use client";

import Link from "next/link";
import {
  Zap,
  ArrowLeft,
  Activity,
  TrendingUp,
  TrendingDown,
  Gauge,
  BookOpen,
  BarChart3,
  Bell,
  Wifi,
  Terminal,
  Database,
  Code2,
  MessageCircle,
  ChevronRight,
} from "lucide-react";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "features", label: "Features" },
  { id: "dashboard", label: "Dashboard" },
  { id: "smart-trade", label: "Smart Trade" },
  { id: "orderbook-imbalance", label: "Orderbook Imbalance" },
  { id: "whale-detection", label: "Whale Detection" },
  { id: "telegram", label: "Telegram Bot" },
  { id: "api", label: "API Reference" },
  { id: "websocket", label: "WebSocket" },
  { id: "architecture", label: "Architecture" },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={16} />
              <span className="text-sm">Back to Dashboard</span>
            </Link>
            <div className="w-px h-5 bg-zinc-700" />
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Whale Watcher" className="w-8 h-8 rounded-lg" />
              <div>
                <span className="font-bold">Whale Watcher</span>
                <span className="text-zinc-500 text-sm ml-2">Docs</span>
              </div>
            </div>
          </div>
          <a
            href="https://pacifica.fi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Powered by Pacifica ↗
          </a>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-10 flex gap-10">
        {/* Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24 space-y-1">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
              On this page
            </p>
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-zinc-900 transition-colors"
              >
                <ChevronRight size={12} />
                {s.label}
              </a>
            ))}
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 max-w-3xl space-y-16">
          {/* Overview */}
          <section id="overview">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-medium mb-4">
              Pacifica Hackathon 2026 · Track 2: Analytics & Data
            </div>
            <h1 className="text-4xl font-bold mb-4">Whale Watcher</h1>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Real-time whale tracking and orderbook imbalance analytics for
              Pacifica perpetual markets. Monitor large trades, visualize
              bid/ask pressure, and receive personalized alerts — all in one
              dashboard.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-8">
              {[
              { icon: Activity, label: "Real-time Whale Feed", color: "text-green-500" },
                { icon: Gauge, label: "Orderbook Imbalance", color: "text-purple-500" },
                { icon: BookOpen, label: "Order Flow Board", color: "text-blue-500" },
                { icon: BarChart3, label: "Volume Analytics", color: "text-orange-500" },
                { icon: Bell, label: "Telegram Alerts", color: "text-cyan-500" },
                { icon: Wifi, label: "Smart Trade Signals", color: "text-yellow-500" },
              ].map(({ icon: Icon, label, color }) => (
                <div
                  key={label}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-start gap-3"
                >
                  <Icon size={18} className={color} />
                  <span className="text-sm text-zinc-300">{label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Features */}
          <section id="features">
            <SectionTitle>Features</SectionTitle>
            <div className="space-y-6">
              <Feature
                icon={<Activity size={20} className="text-green-500" />}
                title="Real-time Whale Detection"
                description="Monitors every trade on Pacifica perpetuals via WebSocket. When a trade exceeds the configured threshold, it is instantly classified, stored, and broadcast to all connected clients."
              />
              <Feature
                icon={<Gauge size={20} className="text-purple-500" />}
                title="Orderbook Imbalance Indicator"
                description="Aggregates bid and ask volume from the top orderbook levels (Pacifica book stream) and computes a normalized imbalance ratio. Updates every 250ms per Pacifica's stream cadence."
              />
              <Feature
                icon={<BookOpen size={20} className="text-blue-500" />}
                title="Order Flow Board"
                description="Splits detected whale trades into separate buy and sell columns for visual comparison, with total volume and pressure percentage shown at the bottom."
              />
              <Feature
                icon={<BarChart3 size={20} className="text-orange-500" />}
                title="Volume Analytics"
                description="Shows 24-hour buy vs sell volume distribution as a bar chart, top 5 largest buys and sells, net flow, and market sentiment indicator."
              />
              <Feature
                icon={<Bell size={20} className="text-cyan-500" />}
                title="Telegram Alerts"
                description="Each user can set their own minimum trade size for alerts. Quick templates at $10k, $50k, and $100k plus a custom /set_<amount> command."
              />
            </div>
          </section>

          {/* Dashboard */}
          <section id="dashboard">
            <SectionTitle>Dashboard</SectionTitle>
            <p className="text-zinc-400 mb-6">
              The dashboard has five tabs. A symbol filter (ALL / BTC / ETH / SOL) applies globally.
            </p>
            <div className="space-y-4">
              <TabCard
                name="Overview"
                icon={<Activity size={16} className="text-blue-500" />}
                items={[
                  "Live whale activity feed with real-time updates",
                  "Orderbook Imbalance indicator with per-symbol breakdown",
                  "Volume Distribution chart (24h buy vs sell)",
                ]}
              />
              <TabCard
                name="Order Book"
                icon={<BookOpen size={16} className="text-green-500" />}
                items={[
                  "Side-by-side buy and sell whale flow",
                  "Total volume per side",
                  "Buy/sell pressure progress bar",
                ]}
              />
              <TabCard
                name="Analytics"
                icon={<BarChart3 size={16} className="text-orange-500" />}
                items={[
                  "Top 5 largest buy trades and sells",
                  "Volume by symbol with buy-sell ratio",
                  "Market sentiment gauge",
                ]}
              />
              <TabCard
                name="Smart Trade"
                icon={<Activity size={16} className="text-yellow-500" />}
                items={[
                  "Signal per symbol: LONG / SHORT / HOLD with confidence %",
                  "Combines orderbook imbalance + whale flow + activity level",
                  "One-click link to execute on Pacifica testnet",
                ]}
              />
              <TabCard
                name="Portfolio"
                icon={<Wifi size={16} className="text-purple-500" />}
                items={[
                  "Account equity, balance, margin used, available",
                  "Open positions with unrealized PnL",
                  "Quick links to deposit",
                ]}
              />
            </div>
          </section>

          {/* Smart Trade */}
          <section id="smart-trade">
            <SectionTitle>Smart Trade</SectionTitle>
            <p className="text-zinc-400 mb-6">
              The signal engine combines multiple data sources into a single
              actionable recommendation per symbol.
            </p>

            <h3 className="font-semibold mb-3">Signal Factors</h3>
            <div className="space-y-3 mb-8">
              {[
                { weight: "50%", name: "Orderbook Imbalance", desc: "Bid/ask volume ratio from top 10 levels" },
                { weight: "30%", name: "Whale Flow Direction", desc: "% of recent whale volume that is buy vs sell" },
                { weight: "20%", name: "Whale Activity Level", desc: "Number of recent whale trades (more = higher confidence)" },
              ].map(({ weight, name, desc }) => (
                <div key={name} className="flex items-start gap-4 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
                  <span className="text-yellow-400 font-mono font-bold text-sm shrink-0 w-12">{weight}</span>
                  <div>
                    <div className="font-semibold text-sm">{name}</div>
                    <div className="text-xs text-zinc-500">{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="font-semibold mb-3">Direction Logic</h3>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-300 space-y-1">
              <div><span className="text-green-400 font-bold">LONG</span> — imbalance bullish + whale buy dominant + confidence {"≥"} 30%</div>
              <div><span className="text-red-400 font-bold">SHORT</span> — imbalance bearish + whale sell dominant + confidence {"≥"} 30%</div>
              <div><span className="text-zinc-400 font-bold">HOLD</span> — mixed signals or low confidence</div>
            </div>
          </section>

          {/* Orderbook Imbalance */}
          <section id="orderbook-imbalance">
            <SectionTitle>Orderbook Imbalance</SectionTitle>
            <p className="text-zinc-400 mb-6">
              Reads the Pacifica{" "}
              <Code>book</Code> WebSocket stream and calculates the
              ratio of bid volume to total volume across the top 10 price
              levels.
            </p>

            <h3 className="font-semibold mb-3">Signal States</h3>
            <div className="space-y-2 mb-8">
              {[
                { state: "STRONG BUY", range: "> +20% imbalance", color: "text-green-400 bg-green-500/10 border-green-500/20" },
                { state: "BUY PRESSURE", range: "+5% to +20%", color: "text-green-500 bg-green-500/5 border-green-500/10" },
                { state: "NEUTRAL", range: "-5% to +5%", color: "text-zinc-400 bg-zinc-800/50 border-zinc-700" },
                { state: "SELL PRESSURE", range: "-20% to -5%", color: "text-red-500 bg-red-500/5 border-red-500/10" },
                { state: "STRONG SELL", range: "< -20% imbalance", color: "text-red-400 bg-red-500/10 border-red-500/20" },
              ].map(({ state, range, color }) => (
                <div
                  key={state}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-lg border ${color}`}
                >
                  <span className="font-bold text-sm">{state}</span>
                  <span className="text-xs opacity-70">{range}</span>
                </div>
              ))}
            </div>

            <h3 className="font-semibold mb-3">Formula</h3>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 font-mono text-sm text-zinc-300 space-y-1">
              <div>bid_volume = Σ (price × size) for top 10 bid levels</div>
              <div>ask_volume = Σ (price × size) for top 10 ask levels</div>
              <div>ratio = bid_volume / (bid_volume + ask_volume)</div>
              <div className="text-blue-400">imbalance_pct = (ratio − 0.5) × 200</div>
            </div>
          </section>

          {/* Whale Detection */}
          <section id="whale-detection">
            <SectionTitle>Whale Detection</SectionTitle>
            <p className="text-zinc-400 mb-6">
              The backend subscribes to the Pacifica{" "}
              <Code>trades</Code> stream and checks each trade against
              per-symbol thresholds.
            </p>

            <h3 className="font-semibold mb-3">Thresholds</h3>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500">
                    <th className="px-5 py-3 text-left">Symbol</th>
                    <th className="px-5 py-3 text-left">Dashboard Alert</th>
                    <th className="px-5 py-3 text-left">Telegram Default</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { s: "BTC", d: "$10,000", t: "$50,000" },
                    { s: "ETH", d: "$10,000", t: "$50,000" },
                    { s: "SOL", d: "$1,000", t: "$5,000" },
                  ].map(({ s, d, t }) => (
                    <tr key={s} className="border-b border-zinc-800/50">
                      <td className="px-5 py-3 font-mono font-bold">{s}</td>
                      <td className="px-5 py-3 text-green-400">{d}</td>
                      <td className="px-5 py-3 text-blue-400">{t}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="font-semibold mb-3">Trade Direction Mapping</h3>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 font-mono text-sm space-y-1 text-zinc-300">
              <div><span className="text-green-400">open_long</span> / <span className="text-green-400">close_short</span> → <span className="text-white">BUY</span></div>
              <div><span className="text-red-400">open_short</span> / <span className="text-red-400">close_long</span> → <span className="text-white">SELL</span></div>
            </div>
          </section>

          {/* Telegram */}
          <section id="telegram">
            <SectionTitle>Telegram Bot</SectionTitle>
            <p className="text-zinc-400 mb-6">
              Search{" "}
              <a
                href="https://t.me/watcherWallerWhales_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                @watcherWallerWhales_bot
              </a>{" "}
              on Telegram to subscribe. Each user has an independent threshold
              stored per chat session.
            </p>

            <div className="space-y-3">
              {[
                { cmd: "/start", desc: "Subscribe to whale alerts (default threshold: $50,000)" },
                { cmd: "/threshold", desc: "Show threshold menu with quick-select options" },
                { cmd: "/set_10000", desc: "Set threshold to $10,000 (small whales)" },
                { cmd: "/set_50000", desc: "Set threshold to $50,000 (medium whales)" },
                { cmd: "/set_100000", desc: "Set threshold to $100,000 (large whales)" },
                { cmd: "/set_<amount>", desc: "Set any custom threshold, minimum $1,000" },
                { cmd: "/status", desc: "Show current subscription and threshold" },
                { cmd: "/stop", desc: "Unsubscribe from all alerts" },
              ].map(({ cmd, desc }) => (
                <div
                  key={cmd}
                  className="flex items-start gap-4 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3"
                >
                  <code className="text-blue-400 font-mono text-sm shrink-0 w-40">{cmd}</code>
                  <span className="text-zinc-400 text-sm">{desc}</span>
                </div>
              ))}
            </div>
          </section>

          {/* API */}
          <section id="api">
            <SectionTitle>API Reference</SectionTitle>
            <p className="text-zinc-400 mb-6">
Base URL: <Code>https://43.157.201.151.sslip.io</Code>
            </p>

            <div className="space-y-3">
              {[
                { method: "GET", path: "/health", desc: "Health check + WebSocket client count" },
                { method: "GET", path: "/api/v1/whales/recent", desc: "Recent whale alerts (query: symbol, limit)" },
                { method: "GET", path: "/api/v1/whales/stats", desc: "Whale statistics for 24h (query: symbol, hours)" },
                { method: "GET", path: "/api/v1/whales/symbols", desc: "All symbols with whale activity" },
                { method: "GET", path: "/api/v1/markets", desc: "All available Pacifica markets" },
              { method: "GET", path: "/api/v1/markets/imbalance", desc: "Aggregated orderbook imbalance (query: symbol)" },
                { method: "GET", path: "/api/v1/markets/{symbol}/imbalance", desc: "Imbalance for a single symbol" },
                { method: "GET", path: "/api/v1/trading/signals", desc: "Smart trade signals for all symbols" },
                { method: "GET", path: "/api/v1/trading/signals/{symbol}", desc: "Signal for a specific symbol" },
                { method: "GET", path: "/api/v1/trading/account", desc: "Pacifica account info (query: account)" },
                { method: "GET", path: "/api/v1/trading/positions", desc: "Open positions (query: account)" },
              ].map(({ method, path, desc }) => (
                <div
                  key={path}
                  className="flex items-start gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3"
                >
                  <span className="text-xs font-bold bg-green-500/20 text-green-400 px-2 py-1 rounded font-mono shrink-0">
                    {method}
                  </span>
                  <div>
                    <code className="text-sm text-white">{path}</code>
                    <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* WebSocket */}
          <section id="websocket">
            <SectionTitle>WebSocket</SectionTitle>
            <p className="text-zinc-400 mb-4">
Connect to <Code>wss://43.157.201.151.sslip.io/ws/whales</Code> for a
              persistent real-time stream.
            </p>

            <h3 className="font-semibold mb-3">Message Types</h3>
            <div className="space-y-4">
              {[
                {
                  type: "initial_data",
                  dir: "← server",
                  color: "text-blue-400",
                  desc: "Sent on connect. Contains recent whale alerts array and current imbalance snapshot.",
                  example: `{ "type": "initial_data", "data": [...alerts], "imbalances": {...} }`,
                },
                {
                  type: "whale_alert",
                  dir: "← server",
                  color: "text-green-400",
                  desc: "Fired whenever a new whale trade is detected above the configured threshold.",
                  example: `{ "type": "whale_alert", "data": { "symbol": "BTC", "side": "buy", "usd_value": 12500, ... } }`,
                },
                {
                  type: "imbalance_update",
                  dir: "← server",
                  color: "text-purple-400",
                  desc: "Throttled to once per second per symbol. Contains the latest orderbook imbalance data.",
                  example: `{ "type": "imbalance_update", "data": { "symbol": "BTC", "imbalance_pct": 41.5, ... } }`,
                },
                {
                  type: "ping",
                  dir: "→ client",
                  color: "text-zinc-400",
                  desc: "Send every 25 seconds to keep the connection alive.",
                  example: `{ "type": "ping" }`,
                },
              ].map(({ type, dir, color, desc, example }) => (
                <div
                  key={type}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <code className={`font-mono font-bold ${color}`}>{type}</code>
                    <span className="text-xs text-zinc-600">{dir}</span>
                  </div>
                  <p className="text-sm text-zinc-400 mb-3">{desc}</p>
                  <pre className="bg-black rounded-lg px-4 py-3 text-xs text-zinc-400 overflow-x-auto">
                    {example}
                  </pre>
                </div>
              ))}
            </div>
          </section>

          {/* Architecture */}
          <section id="architecture">
            <SectionTitle>Architecture</SectionTitle>
            <p className="text-zinc-400 mb-6">
              The system connects to two Pacifica WebSocket channels
              simultaneously: <Code>trades</Code> for whale detection and{" "}
              <Code>book</Code> for orderbook imbalance.
            </p>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 font-mono text-sm text-zinc-400 leading-loose mb-8">
              <div className="text-blue-400">Pacifica WebSocket</div>
              <div className="pl-4">├── <span className="text-green-400">trades</span> stream (BTC / ETH / SOL)</div>
              <div className="pl-4">└── <span className="text-purple-400">book</span> stream (BTC / ETH / SOL, agg_level=1)</div>
              <div className="mt-2 text-blue-400">FastAPI Backend</div>
              <div className="pl-4">├── <span className="text-zinc-300">WhaleDetector</span> → filters by threshold → DB + broadcast</div>
              <div className="pl-4">├── <span className="text-zinc-300">OrderbookMonitor</span> → computes imbalance → broadcast (throttled)</div>
              <div className="pl-4">└── <span className="text-zinc-300">TelegramBot</span> → per-user threshold → sends alert</div>
              <div className="mt-2 text-blue-400">Next.js Frontend</div>
              <div className="pl-4">├── <span className="text-zinc-300">WhaleWebSocketContext</span> (shared, 1 connection / tab)</div>
              <div className="pl-4">├── <span className="text-zinc-300">WhaleActivityFeed</span></div>
              <div className="pl-4">├── <span className="text-zinc-300">OrderbookImbalance</span></div>
              <div className="pl-4">├── <span className="text-zinc-300">WhaleOrderBook</span></div>
              <div className="pl-4">└── <span className="text-zinc-300">WhaleAnalytics</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <Terminal size={16} className="text-blue-400" />, label: "Backend", value: "FastAPI + SQLAlchemy" },
                { icon: <Code2 size={16} className="text-green-400" />, label: "Frontend", value: "Next.js 16 + Tailwind" },
                { icon: <Database size={16} className="text-orange-400" />, label: "Database", value: "PostgreSQL (Supabase)" },
                { icon: <MessageCircle size={16} className="text-cyan-400" />, label: "Alerts", value: "Telegram Bot API" },
              ].map(({ icon, label, value }) => (
                <div
                  key={label}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-3"
                >
                  {icon}
                  <div>
                    <div className="text-xs text-zinc-500">{label}</div>
                    <div className="text-sm font-medium">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Footer */}
          <div className="border-t border-zinc-800 pt-8 flex items-center justify-between text-sm text-zinc-500">
            <span>Built for Pacifica Hackathon 2026</span>
            <a
              href="https://docs.pacifica.fi"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Pacifica API Docs ↗
            </a>
          </div>
        </main>
      </div>
    </div>
  );
}

// Helper components
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
      {children}
    </h2>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function TabCard({
  name,
  icon,
  items,
}: {
  name: string;
  icon: React.ReactNode;
  items: string[];
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="font-semibold">{name} Tab</h3>
      </div>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-zinc-400">
            <span className="text-zinc-600 mt-0.5">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="px-1.5 py-0.5 bg-zinc-800 text-blue-300 rounded text-sm font-mono">
      {children}
    </code>
  );
}
