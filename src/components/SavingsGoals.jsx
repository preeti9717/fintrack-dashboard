const accent = "#7C5CFC";

const GOALS = [
  { id: "car", label: "New Car", current: 10520, target: 50000 },
  { id: "rent", label: "House Rent", current: 10520, target: 150000 },
  { id: "vacation", label: "Vacation", current: 3000, target: 10000 },
];

function formatMoney(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function SavingsGoals() {
  return (
    <section
      className="rounded-xl p-5"
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-card-border)",
      }}
    >
      <h2 className="text-sm font-semibold text-white">Savings goals</h2>
      <p className="mt-0.5 text-xs text-gray-500">
        Progress toward your targets
      </p>

      <ul className="mt-5 space-y-5">
        {GOALS.map((g) => {
          const pct = Math.min(
            100,
            Math.round((g.current / g.target) * 1000) / 10,
          );
          return (
            <li key={g.id}>
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span className="font-medium text-white">{g.label}</span>
                <span className="shrink-0 tabular-nums text-xs text-gray-400">
                  {formatMoney(g.current)}
                  <span className="text-gray-600"> / </span>
                  {formatMoney(g.target)}
                </span>
              </div>
              <div
                className="mt-2 h-2 overflow-hidden rounded-full"
                style={{ backgroundColor: "var(--color-control-bg)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: accent,
                    maxWidth: "100%",
                  }}
                />
              </div>
              <p className="mt-1 text-right text-[11px] tabular-nums text-gray-500">
                {pct}%
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
