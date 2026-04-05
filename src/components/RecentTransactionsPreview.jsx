import { useApp } from "../context/AppContext.jsx";

function formatSignedAmount(type, amount) {
  const abs = Number(amount);
  const prefix = type === "income" ? "+" : "-";
  return `${prefix}$${abs.toFixed(2)}`;
}

function statusClass(status) {
  if (status === "Pending") return "bg-amber-500/15 text-amber-300";
  if (status === "Completed") return "bg-emerald-500/10 text-emerald-300/90";
  return "bg-white/5 text-gray-400";
}

export function RecentTransactionsPreview() {
  const { filteredTransactions } = useApp();
  const rows = filteredTransactions.slice(0, 5);

  return (
    <section
      className="rounded-xl p-5"
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-card-border)",
      }}
    >
      <h2 className="text-sm font-semibold text-white">Recent transactions</h2>
      <p className="mt-0.5 text-xs text-gray-500">
        Latest five · name, amount, category
      </p>
      <ul className="mt-4 divide-y divide-white/[0.06]">
        {rows.map((t) => (
          <li
            key={t.id}
            className="grid gap-2 py-3.5 first:pt-0 last:pb-0 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-x-4"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                {t.description}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-400">{t.category}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusClass(t.status)}`}
                >
                  {t.status}
                </span>
              </div>
            </div>
            <p
              className={`text-sm font-semibold tabular-nums sm:text-right ${
                t.type === "income" ? "text-emerald-400" : "text-white"
              }`}
            >
              {formatSignedAmount(t.type, t.amount)}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
