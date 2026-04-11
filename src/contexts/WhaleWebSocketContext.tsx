"use client";

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";
const HEARTBEAT_INTERVAL = 25000;
const RECONNECT_DELAY = 3000;
const MAX_ALERTS = 100;

export interface WhaleAlertData {
  symbol: string;
  side: string;
  amount: number;
  price: number;
  usd_value: number;
  timestamp: number;
  wallet_address?: string;
}

export interface ImbalanceData {
  symbol: string;
  bid_volume: number;
  ask_volume: number;
  imbalance_ratio: number;
  imbalance_pct: number;
  bid_levels: number;
  ask_levels: number;
  best_bid: number;
  best_ask: number;
  spread: number;
  spread_pct: number;
  timestamp: number;
}

export interface AggregatedImbalance {
  total_bid_volume: number;
  total_ask_volume: number;
  overall_imbalance_ratio: number;
  overall_imbalance_pct: number;
  symbols: Record<string, ImbalanceData>;
}

interface WhaleWebSocketContextType {
  alerts: WhaleAlertData[];
  imbalances: AggregatedImbalance;
  isConnected: boolean;
  lastUpdate: number;
}

const defaultImbalances: AggregatedImbalance = {
  total_bid_volume: 0,
  total_ask_volume: 0,
  overall_imbalance_ratio: 0.5,
  overall_imbalance_pct: 0,
  symbols: {}
};

const WhaleWebSocketContext = createContext<WhaleWebSocketContextType>({
  alerts: [],
  imbalances: defaultImbalances,
  isConnected: false,
  lastUpdate: Date.now(),
});

function getAlertKey(alert: WhaleAlertData): string {
  return `${alert.symbol}-${alert.timestamp}-${alert.amount}-${alert.side}`;
}

export function WhaleWebSocketProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<WhaleAlertData[]>([]);
  const [imbalances, setImbalances] = useState<AggregatedImbalance>(defaultImbalances);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);
  const seenAlertsRef = useRef<Set<string>>(new Set());
  const isConnectingRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    const stopHeartbeat = () => {
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }
    };

    const startHeartbeat = () => {
      stopHeartbeat();
      heartbeatRef.current = setInterval(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: "ping" }));
        }
      }, HEARTBEAT_INTERVAL);
    };

    const addAlert = (alert: WhaleAlertData) => {
      const key = getAlertKey(alert);
      if (seenAlertsRef.current.has(key)) return;

      seenAlertsRef.current.add(key);
      if (seenAlertsRef.current.size > 500) {
        const arr = Array.from(seenAlertsRef.current);
        seenAlertsRef.current = new Set(arr.slice(-250));
      }

      setAlerts((prev) => [alert, ...prev].slice(0, MAX_ALERTS));
      setLastUpdate(Date.now());
    };

    const setInitialAlerts = (newAlerts: WhaleAlertData[]) => {
      seenAlertsRef.current.clear();
      newAlerts.forEach((alert) => seenAlertsRef.current.add(getAlertKey(alert)));
      setAlerts(newAlerts.slice(0, MAX_ALERTS));
      setLastUpdate(Date.now());
    };

    const cleanup = () => {
      stopHeartbeat();
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
        wsRef.current = null;
      }
      isConnectingRef.current = false;
    };

    const connect = () => {
      if (!mountedRef.current) return;
      if (isConnectingRef.current) return;
      if (wsRef.current?.readyState === WebSocket.OPEN) return;
      if (wsRef.current?.readyState === WebSocket.CONNECTING) return;

      isConnectingRef.current = true;

      try {
        const wsUrl = `${WS_URL}/ws/whales`;
        console.log("🔌 [Context] Connecting to WebSocket:", wsUrl);

        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          isConnectingRef.current = false;
          if (!mountedRef.current) {
            ws.close();
            return;
          }
          console.log("✅ [Context] WebSocket connected");
          setIsConnected(true);
          startHeartbeat();
        };

        ws.onmessage = (event) => {
          if (!mountedRef.current) return;
          try {
            const message = JSON.parse(event.data);
            if (message.type === "pong") return;
            if (message.type === "initial_data") {
              console.log("📦 [Context] Initial data:", message.data?.length || 0, "alerts");
              setInitialAlerts(message.data || []);
              if (message.imbalances) {
                setImbalances(message.imbalances);
              }
            } else if (message.type === "whale_alert" && message.data) {
              console.log("🐋 [Context] New whale:", message.data.symbol, "$" + Math.round(message.data.usd_value).toLocaleString());
              addAlert(message.data);
            } else if (message.type === "imbalance_update" && message.data) {
              // Update single symbol imbalance
              const imbalanceData = message.data as ImbalanceData;
              setImbalances(prev => {
                const newSymbols: Record<string, ImbalanceData> = { 
                  ...prev.symbols, 
                  [imbalanceData.symbol]: imbalanceData 
                };
                const values = Object.values(newSymbols);
                const totalBid = values.reduce((sum, d) => sum + d.bid_volume, 0);
                const totalAsk = values.reduce((sum, d) => sum + d.ask_volume, 0);
                const total = totalBid + totalAsk;
                return {
                  total_bid_volume: totalBid,
                  total_ask_volume: totalAsk,
                  overall_imbalance_ratio: total > 0 ? totalBid / total : 0.5,
                  overall_imbalance_pct: total > 0 ? ((totalBid / total) - 0.5) * 200 : 0,
                  symbols: newSymbols
                };
              });
              setLastUpdate(Date.now());
            }
          } catch (e) {
            console.error("Failed to parse message:", e);
          }
        };

        ws.onclose = (event) => {
          console.log("❌ [Context] WebSocket disconnected, code:", event.code);
          isConnectingRef.current = false;
          wsRef.current = null;
          setIsConnected(false);
          stopHeartbeat();

          if (mountedRef.current && event.code !== 1000) {
            reconnectTimeoutRef.current = setTimeout(() => {
              console.log("🔄 [Context] Reconnecting...");
              connect();
            }, RECONNECT_DELAY);
          }
        };

        ws.onerror = () => {
          console.log("⚠️ [Context] WebSocket error");
          isConnectingRef.current = false;
        };
      } catch (error) {
        console.error("Failed to create WebSocket:", error);
        isConnectingRef.current = false;
        if (mountedRef.current) {
          reconnectTimeoutRef.current = setTimeout(connect, RECONNECT_DELAY * 2);
        }
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible" && mountedRef.current) {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
          console.log("👁️ [Context] Tab visible, reconnecting...");
          connect();
        }
      }
    };

    connect();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      mountedRef.current = false;
      document.removeEventListener("visibilitychange", handleVisibility);
      cleanup();
    };
  }, []);

  return (
    <WhaleWebSocketContext.Provider value={{ alerts, imbalances, isConnected, lastUpdate }}>
      {children}
    </WhaleWebSocketContext.Provider>
  );
}

export function useWhaleData() {
  return useContext(WhaleWebSocketContext);
}
