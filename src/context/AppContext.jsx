import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  user,
  summaryCards,
  balanceTrend,
  spendingByCategory,
  transactions as initialTransactions,
  insights,
  totalBalance,
  totalIncome,
  totalExpenses,
  totalSavings,
} from "../data/mockData.js";

const AppContext = createContext(null);
const THEME_STORAGE_KEY = "finance-dashboard-theme";

const defaultFilters = {
  search: "",
  category: "All",
  type: "All",
  sortBy: "date",
};

function compareByDateDesc(a, b) {
  return new Date(b.date) - new Date(a.date);
}

function compareByAmountDesc(a, b) {
  return Number(b.amount) - Number(a.amount);
}

export function AppProvider({ children }) {
  const [transactions, setTransactions] = useState(() => initialTransactions);
  const [role, setRole] = useState("viewer");
  const [filters, setFiltersState] = useState(defaultFilters);
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return savedTheme === "light" ? "light" : "dark";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = window.document.getElementById("root");
    if (!root) return;

    root.classList.remove("theme-dark", "theme-light");
    root.classList.add(theme === "light" ? "theme-light" : "theme-dark");
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const addTransaction = useCallback((payload) => {
    const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setTransactions((prev) => [
      {
        id,
        description: payload.description.trim(),
        category: payload.category,
        type: payload.type,
        amount: Math.abs(Number(payload.amount)),
        date: payload.date,
        status: payload.status,
      },
      ...prev,
    ]);
  }, []);

  const setFilters = useCallback((update) => {
    setFiltersState((prev) =>
      typeof update === "function" ? update(prev) : { ...prev, ...update },
    );
  }, []);

  const filteredTransactions = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    let list = transactions.filter((t) => {
      if (q && !t.description.toLowerCase().includes(q)) return false;
      if (filters.category !== "All" && t.category !== filters.category)
        return false;
      if (filters.type !== "All" && t.type !== filters.type) return false;
      return true;
    });

    const sorted = [...list];
    if (filters.sortBy === "amount") {
      sorted.sort(compareByAmountDesc);
    } else {
      sorted.sort(compareByDateDesc);
    }

    return sorted;
  }, [transactions, filters]);

  const summaryStats = useMemo(
    () => ({
      totalBalance,
      totalIncome,
      totalExpenses,
      totalSavings,
    }),
    [],
  );

  const value = useMemo(
    () => ({
      transactions,
      addTransaction,
      role,
      setRole,
      theme,
      setTheme,
      filters,
      setFilters,
      filteredTransactions,
      summaryStats,
      user,
      summaryCards,
      balanceTrend,
      spendingByCategory,
      insights,
    }),
    [
      transactions,
      addTransaction,
      role,
      setRole,
      theme,
      setTheme,
      filters,
      setFilters,
      filteredTransactions,
      summaryStats,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used within AppProvider");
  }
  return ctx;
}
