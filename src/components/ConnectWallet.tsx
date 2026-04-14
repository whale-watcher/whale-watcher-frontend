"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useState } from "react";
import { Wallet, LogOut, Bell, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function ConnectWallet() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const [showTelegramModal, setShowTelegramModal] = useState(false);

  if (!ready) {
    return (
      <button className="px-4 py-2 bg-zinc-800 rounded-lg text-sm animate-pulse">
        Loading...
      </button>
    );
  }

  if (!authenticated) {
    return (
      <button
        onClick={login}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
      >
        <Wallet size={16} />
        Connect Wallet
      </button>
    );
  }

  const walletAddress = user?.wallet?.address;
  const shortAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : "Connected";

  return (
    <div className="flex items-center gap-3">
      {/* Telegram Alert Button */}
      <button
        onClick={() => setShowTelegramModal(true)}
        className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition-colors"
        title="Set up Telegram alerts"
      >
        <Bell size={16} />
      </button>

      {/* Wallet Info */}
      <div className="flex items-center gap-2 px-3 py-2 bg-zinc-800 rounded-lg">
        <div className="w-2 h-2 bg-green-500 rounded-full" />
        <span className="text-sm font-mono">{shortAddress}</span>
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
        title="Disconnect"
      >
        <LogOut size={16} />
      </button>

      {/* Telegram Modal */}
      {showTelegramModal && (
        <TelegramModal
          walletAddress={walletAddress || ""}
          onClose={() => setShowTelegramModal(false)}
        />
      )}
    </div>
  );
}

function TelegramModal({
  walletAddress,
  onClose,
}: {
  walletAddress: string;
  onClose: () => void;
}) {
  const botUsername = "watcherWallerWhales_bot";

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] pt-48 px-4">
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">🔔 Telegram Alerts</h3>

        <div className="space-y-4">
          <p className="text-sm text-zinc-400">
            Get instant whale alerts on Telegram! Follow these steps:
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                1
              </span>
              <div>
                <p className="text-sm">Open our Telegram bot</p>
                <a
                  href={`https://t.me/${botUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-400 text-sm mt-1"
                >
                  @{botUsername}
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                2
              </span>
              <div>
                <p className="text-sm">
                  Send <code className="bg-zinc-800 px-1.5 py-0.5 rounded">/start</code> to subscribe
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                3
              </span>
              <div>
                <p className="text-sm">You&apos;ll receive alerts when whales trade!</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800">
            <p className="text-xs text-zinc-500 mb-3">
              Your wallet: <code className="text-zinc-400">{walletAddress.slice(0, 10)}...</code>
            </p>
            <a
              href={`https://t.me/${botUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
            >
              Open Telegram Bot
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
