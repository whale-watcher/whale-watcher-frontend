# Frontend - Whale Watcher
Next.js dashboard for real-time whale activity and orderbook imbalance.

## Stack
- Next.js 16 (App Router)
- React
- Tailwind CSS
- Recharts
- Privy Auth

## Run locally
```bash
npm install
cp .env.example .env.local
npm run dev
```

## Required env vars
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
NEXT_PUBLIC_PRIVY_CLIENT_ID=your_privy_client_id
NEXT_PUBLIC_SOLANA_CLUSTER=devnet
```

`NEXT_PUBLIC_SOLANA_CLUSTER` supports `devnet`, `mainnet`, and `testnet`. The frontend now defaults to `devnet` when this variable is omitted.

## Main UI modules
- `src/app/dashboard.tsx` - Main dashboard layout and tabs
- `src/components/dashboard/WhaleActivityFeed.tsx` - Live whale feed
- `src/components/dashboard/WhaleOrderBook.tsx` - Buy/sell order flow board
- `src/components/dashboard/WhaleAnalytics.tsx` - Analytics widgets
- `src/components/dashboard/OrderbookImbalance.tsx` - Bid/ask pressure indicator
- `src/contexts/WhaleWebSocketContext.tsx` - Shared WebSocket state

## WebSocket events consumed
- `initial_data`
- `whale_alert`
- `imbalance_update`
- `pong`

## Build check
```bash
npm run build
```
