"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "bg-zinc-900 border border-zinc-800 rounded-xl p-5",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-400">{title}</p>
          <p
            className={cn(
              "text-2xl font-bold mt-1",
              trend === "up" && "text-green-500",
              trend === "down" && "text-red-500",
              trend === "neutral" && "text-white"
            )}
          >
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div
            className={cn(
              "p-2 rounded-lg",
              trend === "up" && "bg-green-500/10 text-green-500",
              trend === "down" && "bg-red-500/10 text-red-500",
              !trend && "bg-zinc-800 text-zinc-400"
            )}
          >
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  );
}
