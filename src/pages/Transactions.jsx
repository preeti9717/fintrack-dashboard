import { Header } from "../components/Header.jsx";
import { Search, ChevronDown, Receipt, Pencil, Download } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

const CATEGORY_OPTIONS = [
  "All",
  "Food",
  "Salary",
  "Shopping",
  "Rent",
  "Entertainment",
  "Health",
];

const CATEGORY_BADGE = {
  Food: "bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/25",
  Salary: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/25",
  Shopping: "bg-fuchsia-500/15 text-fuchsia-300 ring-1 ring-fuchsia-500/25",
  Rent: "bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/25",
  Entertainment: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/25",
  Health: "bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/25",
};

const selectClass =
  "theme-input h-10 w-full cursor-pointer appearance-none rounded-lg border pl-3 pr-9 text-sm outline-none focus:border-[#7C5CFC]/50 focus:ring-1 focus:ring-[#7C5CFC]/30 sm:w-auto sm:min-w-[140px]";

function formatDate(iso) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso + "T12:00:00"));
}

function statusBadgeClass(status) {
  if (status === "Paid")
    return "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/25";
  if (status === "Pending")
    return "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/25";
  if (status === "Completed")
    return "bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/25";
  return "bg-white/5 text-gray-400 ring-1 ring-white/10";
}

function categoryBadgeClass(category) {
  return (
    CATEGORY_BADGE[category] ?? "bg-white/5 text-gray-300 ring-1 ring-white/10"
  );
}

function escapeCsvValue(value) {
  const raw = value == null ? "" : String(value);
  return `"${raw.replace(/"/g, '""')}"`;
}

export function Transactions() {
  const { filteredTransactions, filters, setFilters, role } = useApp();
  const isAdmin = role === "admin";

  function handleExportCsv() {
    const headers = [
      "Date",
      "Description",
      "Category",
      "Type",
      "Amount",
      "Status",
    ];

    const rows = filteredTransactions.map((t) => [
      t.date,
      t.description,
      t.category,
      t.type,
      Number(t.amount).toFixed(2),
      t.status,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsvValue).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "fintrack-transactions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <Header />
      <div className="page-fade-in min-h-[calc(100vh-1px)] bg-page px-4 py-6 sm:px-6 md:px-8 md:py-8 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-[1400px] space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-white">Transactions</h2>
            <p className="text-sm text-gray-500">
              Filter and review all activity
            </p>
          </div>

          <div
            className="rounded-xl p-4 md:p-5"
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-card-border)",
            }}
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-4">
              <div className="flex w-full flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end lg:gap-4">
                <label className="block min-w-0 flex-1 lg:max-w-xs">
                  <span className="mb-1.5 block text-xs font-medium text-gray-400">
                    Search
                  </span>
                  <div className="relative">
                    <Search
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
                      strokeWidth={2}
                    />
                    <input
                      type="search"
                      value={filters.search}
                      onChange={(e) => setFilters({ search: e.target.value })}
                      placeholder="Search description…"
                      className="theme-input w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#7C5CFC]/50 focus:ring-1 focus:ring-[#7C5CFC]/30"
                    />
                  </div>
                </label>

                <label className="block w-full sm:w-auto">
                  <span className="mb-1.5 block text-xs font-medium text-gray-400">
                    Category
                  </span>
                  <div className="relative">
                    <select
                      className={selectClass}
                      value={filters.category}
                      onChange={(e) => setFilters({ category: e.target.value })}
                    >
                      {CATEGORY_OPTIONS.map((c) => (
                        <option key={c} value={c} className="theme-option">
                          {c}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                      aria-hidden
                    />
                  </div>
                </label>

                <label className="block w-full sm:w-auto">
                  <span className="mb-1.5 block text-xs font-medium text-gray-400">
                    Type
                  </span>
                  <div className="relative">
                    <select
                      className={selectClass}
                      value={filters.type}
                      onChange={(e) => setFilters({ type: e.target.value })}
                    >
                      <option value="All" className="theme-option">
                        All
                      </option>
                      <option value="income" className="theme-option">
                        Income
                      </option>
                      <option value="expense" className="theme-option">
                        Expense
                      </option>
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                      aria-hidden
                    />
                  </div>
                </label>

                <label className="block w-full sm:w-auto">
                  <span className="mb-1.5 block text-xs font-medium text-gray-400">
                    Sort by
                  </span>
                  <div className="relative">
                    <select
                      className={selectClass}
                      value={filters.sortBy}
                      onChange={(e) => setFilters({ sortBy: e.target.value })}
                    >
                      <option value="date" className="theme-option">
                        Date
                      </option>
                      <option value="amount" className="theme-option">
                        Amount
                      </option>
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                      aria-hidden
                    />
                  </div>
                </label>
              </div>

              <button
                type="button"
                onClick={handleExportCsv}
                className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#7C5CFC] bg-transparent px-4 text-sm font-medium text-[#7C5CFC] transition-colors duration-200 ease-out hover:bg-[#7C5CFC] hover:text-white"
              >
                <Download className="h-4 w-4" strokeWidth={2} />
                Export CSV
              </button>
            </div>
          </div>

          <div
            className="overflow-hidden rounded-xl"
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-card-border)",
            }}
          >
            {filteredTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-full"
                  style={{ backgroundColor: "rgba(124, 92, 252, 0.12)" }}
                >
                  <Receipt
                    className="h-7 w-7 text-[#7C5CFC]"
                    strokeWidth={1.75}
                  />
                </div>
                <p className="text-base font-medium text-white">
                  No transactions found
                </p>
                <p className="mt-2 max-w-sm text-sm text-gray-500">
                  Try adjusting your search or filters — nothing matches right
                  now.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[920px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.08] text-xs font-semibold uppercase tracking-wide text-gray-500">
                      <th className="whitespace-nowrap px-4 py-3 md:px-5">#</th>
                      <th className="whitespace-nowrap px-4 py-3 md:px-5">
                        Date
                      </th>
                      <th className="min-w-[180px] px-4 py-3 md:px-5">
                        Description
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 md:px-5">
                        Category
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 md:px-5">
                        Type
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 md:px-5 text-right">
                        Amount
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 md:px-5">
                        Status
                      </th>
                      {isAdmin && (
                        <th className="whitespace-nowrap px-4 py-3 md:px-5 text-right">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06]">
                    {filteredTransactions.map((t, index) => (
                      <tr
                        key={t.id}
                        className="text-gray-400 transition-colors hover:bg-white/[0.03]"
                      >
                        <td className="whitespace-nowrap px-4 py-3.5 tabular-nums text-gray-500 md:px-5">
                          {index + 1}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5 text-white/90 md:px-5">
                          {formatDate(t.date)}
                        </td>
                        <td className="max-w-[280px] px-4 py-3.5 font-medium text-white md:max-w-[320px] md:px-5">
                          <span className="line-clamp-2 md:line-clamp-none">
                            {t.description}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5 md:px-5">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryBadgeClass(t.category)}`}
                          >
                            {t.category}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5 md:px-5">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              t.type === "income"
                                ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/25"
                                : "bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/25"
                            }`}
                          >
                            {t.type === "income" ? "Income" : "Expense"}
                          </span>
                        </td>
                        <td
                          className={`whitespace-nowrap px-4 py-3.5 text-right font-semibold tabular-nums md:px-5 ${
                            t.type === "income"
                              ? "text-emerald-400"
                              : "text-rose-400"
                          }`}
                        >
                          {t.type === "income"
                            ? `+$${Number(t.amount).toFixed(2)}`
                            : `-$${Number(t.amount).toFixed(2)}`}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5 md:px-5">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(t.status)}`}
                          >
                            {t.status}
                          </span>
                        </td>
                        {isAdmin && (
                          <td className="whitespace-nowrap px-4 py-3.5 text-right md:px-5">
                            <button
                              type="button"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/[0.08]"
                            >
                              <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
                              Edit
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
