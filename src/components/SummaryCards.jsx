import { Wallet, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

const accent = "#7C5CFC";

function formatCurrency(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

function ChangeBadge({ pct, Icon }) {
  const isPositive = pct > 0;
  const tone = isPositive ? "text-emerald-400" : "text-rose-400";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums ${tone} bg-white/[0.06]`}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
      {pct > 0 ? "+" : ""}
      {pct.toFixed(2)}%
    </span>
  );
}

const CARD_CONFIG = [
  {
    statKey: "totalBalance",
    label: "Total Balance",
    Icon: Wallet,
    changePct: 15.46,
    BadgeIcon: TrendingUp,
  },
  {
    statKey: "totalIncome",
    label: "Total Income",
    Icon: TrendingUp,
    changePct: 55.48,
    BadgeIcon: TrendingUp,
  },
  {
    statKey: "totalExpenses",
    label: "Total Expenses",
    Icon: TrendingDown,
    changePct: -8.46,
    BadgeIcon: TrendingDown,
  },
  {
    statKey: "totalSavings",
    label: "Total Savings",
    Icon: PiggyBank,
    changePct: 55.46,
    BadgeIcon: TrendingUp,
  },
];

export function SummaryCards() {
  const { summaryStats } = useApp();

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {CARD_CONFIG.map(({ statKey, label, Icon, changePct, BadgeIcon }) => {
        const value = summaryStats[statKey];
        return (
          <article
            key={statKey}
            className="rounded-xl p-5 shadow-sm shadow-black/10 transition-transform duration-300 ease-out hover:scale-[1.015]"
            style={{
              backgroundColor: "var(--color-surface)",
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "var(--color-card-border)",
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                style={{
                  backgroundColor: `${accent}1F`,
                  color: accent,
                }}
              >
                <Icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <ChangeBadge pct={changePct} Icon={BadgeIcon} />
            </div>
            <p className="mt-4 text-sm font-medium text-gray-400">{label}</p>
            <p className="mt-1 text-xl font-semibold tabular-nums tracking-tight text-white sm:text-2xl">
              {formatCurrency(value)}
            </p>
            <p className="mt-2 text-xs text-gray-500">Compare to last month</p>
          </article>
        );
      })}
    </div>
  );
}
