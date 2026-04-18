"use client";

import { HeatMapCell } from "@/lib/ai360/scoring";

interface HeatMapProps {
  cells: HeatMapCell[];
  compact?: boolean;
}

const COLOR_MAP = {
  green: { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-300", fill: "bg-emerald-500" },
  yellow: { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-300", fill: "bg-amber-500" },
  red: { bg: "bg-red-100", text: "text-red-800", border: "border-red-300", fill: "bg-red-500" },
};

export function HeatMap({ cells, compact = false }: HeatMapProps) {
  return (
    <div className={`grid gap-3 ${compact ? "grid-cols-3" : "grid-cols-2 lg:grid-cols-3"}`}>
      {cells.map((cell) => {
        const colors = COLOR_MAP[cell.color];
        return (
          <div
            key={cell.domain}
            className={`rounded-xl border ${colors.border} ${colors.bg} ${compact ? "p-3" : "p-4"}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-semibold ${colors.text}`}>
                {cell.label}
              </span>
              <span className={`text-lg font-bold ${colors.text}`}>
                {cell.percentage}%
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-white/60 rounded-full h-2">
              <div
                className={`${colors.fill} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${cell.percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Circular Score Display ───────────────────────────────────────
interface ScoreCircleProps {
  score: number;
  size?: number;
  label?: string;
}

export function ScoreCircle({ score, size = 160, label }: ScoreCircleProps) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 80 ? "text-emerald-500" :
    score >= 60 ? "text-blue-500" :
    score >= 40 ? "text-amber-500" :
    "text-red-500";

  const strokeColor =
    score >= 80 ? "#10b981" :
    score >= 60 ? "#3b82f6" :
    score >= 40 ? "#f59e0b" :
    "#ef4444";

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${color}`}>{score}</span>
          <span className="text-xs text-gray-400 uppercase">/ 100</span>
        </div>
      </div>
      {label && <span className="mt-2 text-sm font-medium text-gray-600">{label}</span>}
    </div>
  );
}
