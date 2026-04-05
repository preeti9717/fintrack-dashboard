import { useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useApp } from "../../context/AppContext.jsx";

const purple = "#7C5CFC";
const grayStroke = "#6B7280";

const CHART_DATA = [
  { month: "Jan", thisMonth: 38000, lastMonth: 35200 },
  { month: "Feb", thisMonth: 42000, lastMonth: 38500 },
  { month: "Mar", thisMonth: 39000, lastMonth: 36800 },
  { month: "Apr", thisMonth: 45000, lastMonth: 41800 },
  { month: "May", thisMonth: 48000, lastMonth: 44200 },
  { month: "Jun", thisMonth: 52024, lastMonth: 47500 },
];

const RANGE_OPTIONS = ["Weekly", "Monthly", "Yearly"];

function formatK(v) {
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}k`;
  return `$${v}`;
}

export function BalanceTrendChart() {
  const [range, setRange] = useState("Monthly");
  const { theme } = useApp();
  const gradientId = "balanceThisMonthGradient";
  const cardBg = theme === "light" ? "#FFFFFF" : "#1A1A24";
  const cardBorder = theme === "light" ? "#E5E7EB" : "#2A2A3A";
  const axisTick = {
    fill: theme === "light" ? "#6B7280" : "#ffffff",
    fontSize: 11,
    fontWeight: 500,
  };
  const gridStroke = theme === "light" ? "#E5E7EB" : "rgba(255,255,255,0.08)";
  const tooltipLabelColor = theme === "light" ? "#111827" : "#FFFFFF";

  return (
    <div
      className="rounded-xl p-5"
      style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white">Balance Trend</h2>
          <p className="text-xs text-gray-500">This month vs last month</p>
        </div>
        <div
          className="flex shrink-0 rounded-lg p-0.5"
          style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
          role="tablist"
          aria-label="Chart range (preview)"
        >
          {RANGE_OPTIONS.map((label) => (
            <button
              key={label}
              type="button"
              role="tab"
              aria-selected={range === label}
              onClick={() => setRange(label)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                range === label
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={CHART_DATA}
            margin={{ top: 8, right: 12, left: 4, bottom: 4 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={purple} stopOpacity={0.45} />
                <stop offset="100%" stopColor={purple} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={gridStroke}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={axisTick}
              axisLine={{ stroke: gridStroke }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatK}
              tick={axisTick}
              axisLine={false}
              tickLine={false}
              width={44}
              domain={["dataMin - 2000", "dataMax + 2000"]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: "8px",
                fontSize: "12px",
              }}
              labelStyle={{ color: tooltipLabelColor, fontWeight: 600 }}
              formatter={(value, name) => [
                `$${Number(value).toLocaleString()}`,
                name,
              ]}
            />
            <Area
              type="monotone"
              dataKey="thisMonth"
              name="This Month"
              stroke={purple}
              strokeWidth={2.5}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{ r: 4, fill: purple, stroke: "#fff", strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="lastMonth"
              name="Last Month"
              stroke={grayStroke}
              strokeWidth={2}
              strokeDasharray="6 5"
              dot={false}
              connectNulls
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-6 text-xs">
        <span className="inline-flex items-center gap-2 text-white">
          <span
            className="h-0.5 w-6 rounded-full"
            style={{ backgroundColor: purple }}
          />
          This Month
        </span>
        <span className="inline-flex items-center gap-2 text-gray-400">
          <span
            className="h-0 w-6 border-t-2 border-dashed"
            style={{ borderColor: grayStroke }}
          />
          Last Month
        </span>
      </div>
    </div>
  );
}
