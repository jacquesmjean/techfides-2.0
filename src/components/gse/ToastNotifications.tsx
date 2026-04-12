"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Real-time Toast Notification System for C&C
 *
 * Polls for new events every 30 seconds and displays toast alerts.
 * In production, replace polling with WebSocket (Pusher/Ably) for instant delivery.
 */

interface Toast {
  id: string;
  type: "whale" | "stall" | "deal" | "project" | "system";
  title: string;
  message: string;
  timestamp: number;
  link?: string;
}

const TOAST_STYLES: Record<string, { icon: string; border: string; bg: string }> = {
  whale: { icon: "\uD83D\uDC33", border: "border-sky-500/40", bg: "bg-sky-500/10" },
  stall: { icon: "\u26A0\uFE0F", border: "border-amber-500/40", bg: "bg-amber-500/10" },
  deal: { icon: "\uD83C\uDFC6", border: "border-green-500/40", bg: "bg-green-500/10" },
  project: { icon: "\uD83D\uDCC2", border: "border-purple-500/40", bg: "bg-purple-500/10" },
  system: { icon: "\u2699\uFE0F", border: "border-slate-500/40", bg: "bg-slate-500/10" },
};

export function ToastNotifications() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Auto-dismiss after 8 seconds
  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 8000);
    return () => clearTimeout(timer);
  }, [toasts]);

  // Poll for events (replace with WebSocket in production)
  useEffect(() => {
    let lastCheck = Date.now();

    const checkForEvents = async () => {
      try {
        const res = await fetch(`/api/v1/notifications/poll?since=${lastCheck}`);
        if (res.ok) {
          const data = await res.json();
          if (data.events && data.events.length > 0) {
            const newToasts: Toast[] = data.events.map((e: { id: string; type: string; title: string; message: string; link?: string }) => ({
              id: e.id || `toast-${Date.now()}-${Math.random()}`,
              type: e.type || "system",
              title: e.title,
              message: e.message,
              timestamp: Date.now(),
              link: e.link,
            }));
            setToasts((prev) => [...prev, ...newToasts].slice(-5)); // max 5 visible
          }
        }
        lastCheck = Date.now();
      } catch {
        // Silently fail — polling is best-effort
      }
    };

    const interval = setInterval(checkForEvents, 30000); // 30s polling
    return () => clearInterval(interval);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 w-80">
      {toasts.map((toast) => {
        const style = TOAST_STYLES[toast.type] || TOAST_STYLES.system;
        return (
          <div
            key={toast.id}
            className={`rounded-xl border ${style.border} ${style.bg} p-4 shadow-2xl backdrop-blur-xl animate-slide-in`}
          >
            <div className="flex items-start gap-3">
              <span className="text-lg mt-0.5">{style.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-200">{toast.title}</p>
                <p className="mt-0.5 text-[11px] text-slate-400 line-clamp-2">{toast.message}</p>
              </div>
              <button
                onClick={() => dismissToast(toast.id)}
                className="text-slate-500 hover:text-white text-xs"
              >
                &#x2715;
              </button>
            </div>
            {toast.link && (
              <a
                href={toast.link}
                className="mt-2 block text-[10px] text-sky-400 hover:text-sky-300"
              >
                View details &rarr;
              </a>
            )}
          </div>
        );
      })}

      <style jsx>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
