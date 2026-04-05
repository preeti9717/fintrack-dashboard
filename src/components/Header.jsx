import { useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Bell, Settings, Plus, ChevronDown } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { AddTransactionModal } from "./AddTransactionModal.jsx";

const accent = "#7C5CFC";

export function Header() {
  const { user, filters, setFilters, role, setRole } = useApp();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [addTransactionOpen, setAddTransactionOpen] = useState(false);
  const closeAddTransaction = useCallback(
    () => setAddTransactionOpen(false),
    [],
  );

  const handleSearchChange = useCallback(
    (event) => {
      const nextValue = event.target.value;
      setFilters({ search: nextValue });
      if (pathname !== "/transactions") {
        navigate("/transactions");
      }
    },
    [navigate, pathname, setFilters],
  );

  return (
    <header
      className="border-b border-border-subtle"
      style={{ backgroundColor: "var(--color-header)" }}
    >
      <div className="px-4 py-4 md:px-6 lg:px-8 lg:py-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:gap-6">
          <div className="shrink-0 xl:min-w-[240px]">
            <h1 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
              Good Morning, {user.firstName}!
            </h1>
            <p className="mt-0.5 text-sm text-gray-400">
              Track your financial activity
            </p>
          </div>

          <div className="mx-auto flex w-full max-w-md flex-1 justify-center xl:max-w-lg">
            <label htmlFor="header-search" className="relative w-full">
              <span className="sr-only">Search transactions</span>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
                strokeWidth={2}
              />
              <input
                id="header-search"
                type="search"
                name="search"
                value={filters.search}
                onChange={handleSearchChange}
                placeholder="Search transactions..."
                className="theme-input w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-[#7C5CFC]/50 focus:ring-1 focus:ring-[#7C5CFC]/30"
                autoComplete="off"
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 xl:shrink-0 xl:gap-3">
            <div className="relative">
              <label htmlFor="role-switch" className="sr-only">
                Role
              </label>
              <select
                id="role-switch"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="theme-input h-10 cursor-pointer appearance-none rounded-lg border pl-3 pr-9 text-sm font-medium outline-none focus:border-[#7C5CFC]/50 focus:ring-1 focus:ring-[#7C5CFC]/30"
              >
                <option value="viewer" className="theme-option">
                  Viewer
                </option>
                <option value="admin" className="theme-option">
                  Admin
                </option>
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                aria-hidden
              />
            </div>

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-transparent text-gray-400 transition-colors duration-200 ease-out hover:bg-white/[0.06] hover:text-white"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" strokeWidth={2} />
            </button>

            <Link
              to="/settings"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-transparent text-gray-400 transition-colors duration-200 ease-out hover:bg-white/[0.06] hover:text-white"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" strokeWidth={2} />
            </Link>

            {role === "admin" && (
              <button
                type="button"
                onClick={() => setAddTransactionOpen(true)}
                className="theme-accent-text inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 ease-out hover:opacity-90"
                style={{ backgroundColor: accent }}
              >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
                <span className="hidden sm:inline">Add Transaction</span>
                <span className="sm:hidden">Add</span>
              </button>
            )}

            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-sm font-semibold text-white"
              style={{ backgroundColor: `${accent}40` }}
              title={user.firstName}
              role="img"
              aria-label={`Account, ${user.firstName}`}
            >
              {user.firstName?.charAt(0).toUpperCase() ?? "A"}
            </div>
          </div>
        </div>
      </div>

      <AddTransactionModal
        isOpen={addTransactionOpen}
        onClose={closeAddTransaction}
      />
    </header>
  );
}
