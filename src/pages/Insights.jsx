import { useMemo } from "react";
import { Header } from "../components/Header.jsx";
import { useApp } from "../context/AppContext.jsx";
import {
  Flame,
  TrendingDown,
  TrendingUp,
  Scale,
  BarChart3,
  PiggyBank,
} from "lucide-react";

const accent = "#7C5CFC";

function parseIso(iso) {
  return new Date(iso + "T12:00:00");
}

function formatMoney(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

/** Sum expenses by category; optional filter on transaction */
function expensesByCategory(transactions, pred = () => true) {
  const map = {};
  for (const t of transactions) {
    if (t.type !== "expense" || !pred(t)) continue;
    const c = t.category;
    map[c] = (map[c] || 0) + Number(t.amount);
  }
  return map;
}

function sumIncomeInMonth(transactions, year, monthIndex) {
  return transactions.reduce((s, t) => {
    if (t.type !== "income") return s;
    const d = parseIso(t.date);
    if (d.getFullYear() === year && d.getMonth() === monthIndex) {
      return s + Number(t.amount);
    }
    return s;
  }, 0);
}

function sumExpensesInMonth(transactions, year, monthIndex) {
  return transactions.reduce((s, t) => {
    if (t.type !== "expense") return s;
    const d = parseIso(t.date);
    if (d.getFullYear() === year && d.getMonth() === monthIndex) {
      return s + Number(t.amount);
    }
    return s;
  }, 0);
}

function savingsMessage(rate) {
  if (rate >= 25) {
    return "Outstanding discipline — you are building wealth faster than most.";
  }
  if (rate >= 15) {
    return "Solid saving habit. A bit more consistency will compound nicely over time.";
  }
  if (rate >= 5) {
    return "You are keeping something aside. Try nudging the rate up when you can.";
  }
  if (rate >= 0) {
    return "Breaking even or barely positive — look for one category to trim next month.";
  }
  return "Spending exceeded income this month — pause discretionary buys and revisit the plan.";
}

export function Insights() {
  const { transactions } = useApp();

  const metrics = useMemo(() => {
    const expenseMapAll = expensesByCategory(transactions);
    const totalSpendAll = Object.values(expenseMapAll).reduce(
      (a, b) => a + b,
      0,
    );

    let topCategory = { name: "—", amount: 0, share: 0 };
    for (const [name, amount] of Object.entries(expenseMapAll)) {
      if (amount > topCategory.amount) {
        topCategory = {
          name,
          amount,
          share: totalSpendAll > 0 ? (amount / totalSpendAll) * 100 : 0,
        };
      }
    }

    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const prev =
      m === 0 ? { year: y - 1, month: 11 } : { year: y, month: m - 1 };

    const spendThis = sumExpensesInMonth(transactions, y, m);
    const spendLast = sumExpensesInMonth(transactions, prev.year, prev.month);

    let monthComparePct = null;
    if (spendLast > 0) {
      monthComparePct = ((spendThis - spendLast) / spendLast) * 100;
    } else if (spendThis > 0) {
      monthComparePct = 100;
    } else {
      monthComparePct = 0;
    }

    const spendingDown = spendThis <= spendLast;
    const hasLastMonthData = spendLast > 0 || spendThis > 0;

    const incomeThis = sumIncomeInMonth(transactions, y, m);
    const pctSpentOfIncome =
      incomeThis > 0
        ? Math.min(100, (spendThis / incomeThis) * 100)
        : spendThis > 0
          ? 100
          : 0;

    const expenseThisMap = expensesByCategory(transactions, (t) => {
      const d = parseIso(t.date);
      return d.getFullYear() === y && d.getMonth() === m;
    });
    const top3 = Object.entries(expenseThisMap)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);
    const top3Max = top3.length ? Math.max(...top3.map((x) => x.amount)) : 0;

    const savedRate =
      incomeThis > 0 ? ((incomeThis - spendThis) / incomeThis) * 100 : 0;

    return {
      topCategory,
      totalSpendAll,
      spendThis,
      spendLast,
      monthComparePct,
      spendingDown,
      hasLastMonthData,
      incomeThis,
      pctSpentOfIncome,
      top3,
      top3Max,
      savedRate,
    };
  }, [transactions]);

  const {
    topCategory,
    totalSpendAll,
    spendThis,
    spendLast,
    monthComparePct,
    spendingDown,
    hasLastMonthData,
    incomeThis,
    pctSpentOfIncome,
    top3,
    top3Max,
    savedRate,
  } = metrics;

  const savedRounded = Math.round(savedRate * 10) / 10;
  const spentPctRounded = Math.round(pctSpentOfIncome * 10) / 10;

  return (
    <>
      <Header />
      <div className="page-fade-in min-h-[calc(100vh-1px)] bg-page px-4 py-6 sm:px-6 md:px-8 md:py-8 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-[1100px]">
          <h2 className="text-lg font-semibold text-white">Insights</h2>
          <p className="mt-1 text-sm text-gray-500">
            Derived from your transaction history (this month uses your device
            calendar).
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            {/* 1. Highest spending category */}
            <article
              className="rounded-xl p-5 md:p-6"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-card-border)",
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: "rgba(249, 115, 22, 0.15)",
                    color: "#fb923c",
                  }}
                >
                  <Flame className="h-5 w-5" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-white">
                    Highest spending category
                  </h3>
                  <p className="mt-3 text-2xl font-bold tabular-nums text-white">
                    {topCategory.name}
                  </p>
                  <p className="mt-1 text-sm text-gray-400">
                    {formatMoney(topCategory.amount)} total
                    {totalSpendAll > 0 ? (
                      <span className="text-gray-600">
                        {" "}
                        · {topCategory.share.toFixed(1)}% of spending
                      </span>
                    ) : null}
                  </p>
                  <div
                    className="mt-4 h-2 overflow-hidden rounded-full"
                    style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, topCategory.share)}%`,
                        backgroundColor: accent,
                      }}
                    />
                  </div>
                </div>
              </div>
            </article>

            {/* 2. Monthly comparison */}
            <article
              className="rounded-xl p-5 md:p-6"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-card-border)",
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    spendingDown
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-rose-500/15 text-rose-400"
                  }`}
                >
                  {spendingDown ? (
                    <TrendingDown className="h-5 w-5" strokeWidth={2} />
                  ) : (
                    <TrendingUp className="h-5 w-5" strokeWidth={2} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-white">
                    Monthly comparison
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Expenses · this month vs last
                  </p>
                  {!hasLastMonthData ? (
                    <p className="mt-4 text-sm text-gray-400">
                      No expense data in these months yet.
                    </p>
                  ) : (
                    <>
                      <div className="mt-4 flex flex-wrap items-end gap-4">
                        <div>
                          <p className="text-xs text-gray-500">This month</p>
                          <p className="text-xl font-semibold tabular-nums text-white">
                            {formatMoney(spendThis)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Last month</p>
                          <p className="text-xl font-semibold tabular-nums text-gray-400">
                            {formatMoney(spendLast)}
                          </p>
                        </div>
                      </div>
                      <p
                        className={`mt-4 inline-flex items-center gap-2 text-lg font-semibold tabular-nums ${
                          spendingDown ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {monthComparePct >= 0 ? "+" : ""}
                        {monthComparePct.toFixed(1)}%
                        {spendingDown ? (
                          <TrendingDown className="h-5 w-5" strokeWidth={2.5} />
                        ) : (
                          <TrendingUp className="h-5 w-5" strokeWidth={2.5} />
                        )}
                      </p>
                      <p className="mt-2 text-sm text-gray-400">
                        {spendingDown
                          ? "Nice — you spent less than last month."
                          : "Spending is up from last month."}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </article>

            {/* 3. Income vs expense ratio */}
            <article
              className="rounded-xl p-5 md:p-6"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-card-border)",
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: "rgba(124, 92, 252, 0.18)",
                    color: accent,
                  }}
                >
                  <Scale className="h-5 w-5" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-white">
                    Income vs expense
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-gray-300">
                    {incomeThis > 0 ? (
                      <>
                        You spent{" "}
                        <span className="font-semibold text-white">
                          {spentPctRounded}%
                        </span>{" "}
                        of your income this month.
                      </>
                    ) : (
                      "No income recorded for this month yet."
                    )}
                  </p>
                  <div
                    className="mt-4 h-3 overflow-hidden rounded-full"
                    style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                  >
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-600/80 to-rose-500/90"
                      style={{ width: `${Math.min(100, pctSpentOfIncome)}%` }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span>100% of income</span>
                  </div>
                </div>
              </div>
            </article>

            {/* 4. Top 3 categories */}
            <article
              className="rounded-xl p-5 md:p-6"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-card-border)",
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: "rgba(56, 189, 248, 0.15)",
                    color: "#38bdf8",
                  }}
                >
                  <BarChart3 className="h-5 w-5" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-white">
                    Top 3 spending categories
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">This month</p>
                  {top3.length === 0 ? (
                    <p className="mt-4 text-sm text-gray-400">
                      No expenses this month yet.
                    </p>
                  ) : (
                    <ul className="mt-4 space-y-4">
                      {top3.map((row, i) => (
                        <li key={row.category}>
                          <div className="flex items-center justify-between gap-2 text-sm">
                            <span className="font-medium text-gray-300">
                              {i + 1}. {row.category}
                            </span>
                            <span className="shrink-0 tabular-nums text-white">
                              {formatMoney(row.amount)}
                            </span>
                          </div>
                          <div
                            className="mt-2 h-1.5 overflow-hidden rounded-full"
                            style={{
                              backgroundColor: "rgba(255,255,255,0.06)",
                            }}
                          >
                            <div
                              className="h-full rounded-full"
                              style={{
                                width:
                                  top3Max > 0
                                    ? `${(row.amount / top3Max) * 100}%`
                                    : "0%",
                                backgroundColor: accent,
                              }}
                            />
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </article>

            {/* 5. Saving rate */}
            <article
              className="rounded-xl p-5 md:p-6 md:col-span-2"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-card-border)",
              }}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: "rgba(52, 211, 153, 0.15)",
                    color: "#34d399",
                  }}
                >
                  <PiggyBank className="h-5 w-5" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-white">
                    Saving rate
                  </h3>
                  <p className="mt-3 text-lg text-gray-200">
                    {incomeThis > 0 ? (
                      <>
                        You saved{" "}
                        <span
                          className={`font-bold tabular-nums ${
                            savedRate >= 0
                              ? "text-emerald-400"
                              : "text-rose-400"
                          }`}
                        >
                          {savedRounded}%
                        </span>{" "}
                        of your income this month.
                      </>
                    ) : (
                      <span className="text-gray-400">
                        Add income this month to see your saving rate.
                      </span>
                    )}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-gray-400">
                    {incomeThis > 0 ? savingsMessage(savedRate) : ""}
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </>
  );
}
