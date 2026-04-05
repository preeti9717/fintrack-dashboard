import { Pie, PieChart, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useApp } from "../../context/AppContext.jsx";

const SEGMENTS = [
  { name: "Food", pct: 30, color: "#7C5CFC" },
  { name: "Shopping", pct: 25, color: "#9B7FFF" },
  { name: "Rent", pct: 20, color: "#C4B5FD" },
  { name: "Entertainment", pct: 15, color: "#6D28D9" },
  { name: "Health", pct: 10, color: "#E879F9" },
];

/** Pie slice values — percentages as weights (sum 100) */
const PIE_DATA = SEGMENTS.map((s) => ({
  ...s,
  value: s.pct,
}));

function formatMoney(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export function SpendingDonutChart() {
  const { summaryStats, theme } = useApp();
  const total = summaryStats.totalExpenses;
  const cardBg = theme === "light" ? "#FFFFFF" : "#1A1A24";
  const cardBorder = theme === "light" ? "#E5E7EB" : "#2A2A3A";

  return (
    <div
      className="rounded-xl p-5"
      style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
    >
      <div className="mb-2">
        <h2 className="text-sm font-semibold text-white">Spending Breakdown</h2>
        <p className="text-xs text-gray-500">By category this period</p>
      </div>

      <div className="relative mx-auto h-[220px] max-w-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={PIE_DATA}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="48%"
              innerRadius="58%"
              outerRadius="82%"
              paddingAngle={2}
              stroke="none"
            >
              {PIE_DATA.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(_value, _name, item) => {
                const row = item?.payload;
                if (!row) return [];
                const share = (total * row.pct) / 100;
                return [`${row.pct}% · ${formatMoney(share)}`, row.name];
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
            Total
          </p>
          <p className="text-lg font-semibold tabular-nums tracking-tight text-white sm:text-xl">
            {formatMoney(total)}
          </p>
        </div>
      </div>

      <ul className="mt-4 space-y-2.5 border-t border-white/[0.08] pt-4">
        {SEGMENTS.map((row) => (
          <li key={row.name} className="flex items-center gap-3 text-sm">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-white/10"
              style={{ backgroundColor: row.color }}
            />
            <span className="font-medium text-white">{row.name}</span>
            <span className="ml-auto tabular-nums text-gray-400">
              {row.pct}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
