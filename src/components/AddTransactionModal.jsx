import { useCallback, useEffect, useId, useState } from "react";
import { X } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

const accent = "#7C5CFC";

const CATEGORIES = [
  "Food",
  "Salary",
  "Shopping",
  "Rent",
  "Entertainment",
  "Health",
];

const STATUSES = ["Paid", "Pending", "Completed"];

const inputClass =
  "theme-input w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-[#7C5CFC]/50 focus:ring-1 focus:ring-[#7C5CFC]/30";
const labelClass = "mb-1.5 block text-xs font-medium text-gray-400";

function todayIso() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const initialForm = () => ({
  description: "",
  amount: "",
  category: "Food",
  type: "expense",
  date: todayIso(),
  status: "Paid",
});

export function AddTransactionModal({ isOpen, onClose }) {
  const idPrefix = useId();
  const { role, addTransaction } = useApp();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const reset = useCallback(() => {
    setForm(initialForm());
    setErrors({});
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (role !== "admin" && isOpen) {
      onClose();
    }
  }, [role, isOpen, onClose]);

  useEffect(() => {
    if (isOpen) reset();
  }, [isOpen, reset]);

  if (role !== "admin") {
    return null;
  }

  if (!isOpen) {
    return null;
  }

  function validate() {
    const next = {};
    if (!form.description.trim()) {
      next.description = "Description is required";
    }
    const amt = Number(form.amount);
    if (form.amount === "" || Number.isNaN(amt) || amt <= 0) {
      next.amount = "Enter a valid amount greater than 0";
    }
    if (!form.category) next.category = "Choose a category";
    if (!form.type) next.type = "Choose a type";
    if (!form.date) next.date = "Choose a date";
    if (!form.status) next.status = "Choose a status";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    addTransaction({
      description: form.description,
      amount: Number(form.amount),
      category: form.category,
      type: form.type,
      date: form.date,
      status: form.status,
    });
    reset();
    onClose();
  }

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${idPrefix}-title`}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Close modal"
        onClick={onClose}
      />

      <div
        className="relative z-10 w-full max-w-md rounded-xl p-6 shadow-2xl shadow-black/40"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-card-border)",
        }}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2
              id={`${idPrefix}-title`}
              className="text-lg font-semibold text-white"
            >
              Add transaction
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              All fields are required
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor={`${idPrefix}-desc`} className={labelClass}>
              Description
            </label>
            <input
              id={`${idPrefix}-desc`}
              type="text"
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              className={inputClass}
              placeholder="e.g. Grocery run"
              autoComplete="off"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-rose-400">{errors.description}</p>
            )}
          </div>

          <div>
            <label htmlFor={`${idPrefix}-amt`} className={labelClass}>
              Amount
            </label>
            <input
              id={`${idPrefix}-amt`}
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(e) => setField("amount", e.target.value)}
              className={inputClass}
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="mt-1 text-xs text-rose-400">{errors.amount}</p>
            )}
          </div>

          <div>
            <label htmlFor={`${idPrefix}-cat`} className={labelClass}>
              Category
            </label>
            <select
              id={`${idPrefix}-cat`}
              value={form.category}
              onChange={(e) => setField("category", e.target.value)}
              className={inputClass}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="theme-option">
                  {c}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-rose-400">{errors.category}</p>
            )}
          </div>

          <div>
            <span className={labelClass}>Type</span>
            <div
              className="flex rounded-lg p-0.5"
              style={{ backgroundColor: "var(--color-control-bg)" }}
            >
              <button
                type="button"
                onClick={() => setField("type", "expense")}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                  form.type === "expense"
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setField("type", "income")}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                  form.type === "income"
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                Income
              </button>
            </div>
            {errors.type && (
              <p className="mt-1 text-xs text-rose-400">{errors.type}</p>
            )}
          </div>

          <div>
            <label htmlFor={`${idPrefix}-date`} className={labelClass}>
              Date
            </label>
            <input
              id={`${idPrefix}-date`}
              type="date"
              value={form.date}
              onChange={(e) => setField("date", e.target.value)}
              className={`${inputClass} theme-date-input`}
            />
            {errors.date && (
              <p className="mt-1 text-xs text-rose-400">{errors.date}</p>
            )}
          </div>

          <div>
            <label htmlFor={`${idPrefix}-status`} className={labelClass}>
              Status
            </label>
            <select
              id={`${idPrefix}-status`}
              value={form.status}
              onChange={(e) => setField("status", e.target.value)}
              className={inputClass}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s} className="theme-option">
                  {s}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="mt-1 text-xs text-rose-400">{errors.status}</p>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-white/15 bg-transparent px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-white/[0.06]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="theme-accent-text rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: accent }}
            >
              Add transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
