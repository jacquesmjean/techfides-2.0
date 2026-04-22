/**
 * TrustBar — Scrolling trust badges showing compliance and technology credentials.
 */

const badges = [
  { label: "Model-Agnostic", icon: "\uD83D\uDD04" },
  { label: "HIPAA Aligned", icon: "\uD83C\uDFE5" },
  { label: "SOC 2 Ready", icon: "\uD83D\uDEE1\uFE0F" },
  { label: "Zero Data Leakage", icon: "\uD83D\uDD12" },
  { label: "Hardware Included", icon: "\u2705" },
  { label: "Monthly Subscription", icon: "\uD83D\uDCBB" },
  { label: "On-Premise AI", icon: "\uD83C\uDFE2" },
  { label: "24/7 Monitoring", icon: "\uD83D\uDCCA" },
  { label: "Multi-Model Support", icon: "\u2699\uFE0F" },
  { label: "CAN-SPAM Compliant", icon: "\uD83D\uDCE7" },
];

export function TrustBar() {
  return (
    <section className="border-y border-slate-800/50 bg-navy-900/30 py-6 overflow-hidden">
      <div className="flex animate-scroll gap-8">
        {/* Double the badges for seamless infinite scroll */}
        {[...badges, ...badges].map((badge, i) => (
          <div
            key={`${badge.label}-${i}`}
            className="flex shrink-0 items-center gap-2 rounded-full border border-slate-700/50 bg-slate-900/50 px-4 py-2"
          >
            <span className="text-sm">{badge.icon}</span>
            <span className="whitespace-nowrap text-xs font-medium text-slate-300">
              {badge.label}
            </span>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
