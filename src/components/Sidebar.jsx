import { NavLink } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Lightbulb,
  Settings,
  LifeBuoy,
  Sun,
  Moon,
  Wallet,
} from "lucide-react";
const accent = "#7C5CFC";

const sections = [
  {
    title: "MAIN",
    items: [
      { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
      {
        to: "/transactions",
        label: "Transactions",
        icon: ArrowLeftRight,
        end: false,
      },
      { to: "/insights", label: "Insights", icon: Lightbulb, end: false },
    ],
  },
  {
    title: "TOOLS",
    items: [
      { to: "/settings", label: "Settings", icon: Settings, end: false },
      { to: "/help", label: "Help & Support", icon: LifeBuoy, end: false },
    ],
  },
];

export function Sidebar() {
  const { theme, setTheme } = useApp();

  return (
    <aside
      className="fixed left-0 top-0 z-40 flex h-screen w-[72px] shrink-0 flex-col border-r border-border-subtle md:w-[240px]"
      style={{ backgroundColor: "var(--color-sidebar)" }}
    >
      <div className="flex items-center gap-3 px-3 py-5 md:px-5">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${accent}26`, color: accent }}
        >
          <Wallet className="h-5 w-5" strokeWidth={2.25} />
        </div>
        <span className="hidden truncate text-base font-semibold tracking-tight text-white md:block">
          FinTrack
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-8 overflow-y-auto px-2 pb-4 md:px-3">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="mb-3 hidden px-3 text-[10px] font-semibold tracking-widest text-gray-500 md:block">
              {section.title}
            </p>
            <ul className="flex flex-col gap-1">
              {section.items.map(({ to, label, icon: Icon, end }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={end}
                    title={label}
                    className={({ isActive }) => {
                      const base =
                        "flex items-center gap-3 rounded-lg py-2.5 text-sm font-medium transition-colors duration-200 ease-out md:px-3";
                      const layoutMobile = "justify-center md:justify-start";
                      if (isActive) {
                        return `${base} ${layoutMobile} theme-accent-text text-white shadow-sm shadow-black/20`;
                      }
                      return `${base} ${layoutMobile} text-gray-400 hover:bg-white/[0.06] hover:text-gray-200`;
                    }}
                    style={({ isActive }) =>
                      isActive ? { backgroundColor: accent } : undefined
                    }
                  >
                    <Icon
                      className="h-[18px] w-[18px] shrink-0 md:h-5 md:w-5"
                      strokeWidth={2}
                    />
                    <span className="hidden md:inline">{label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="mt-auto border-t border-white/[0.08] p-2 md:p-4">
        <p className="mb-2 hidden px-1 text-[10px] font-semibold tracking-widest text-gray-500 md:block">
          APPEARANCE
        </p>
        <div
          className="flex rounded-lg p-0.5"
          style={{ backgroundColor: "var(--color-control-bg)" }}
          role="group"
          aria-label="Theme"
        >
          <button
            type="button"
            onClick={() => setTheme("light")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-gray-400 transition-colors duration-200 ease-out md:px-3 md:py-2 ${
              theme === "light"
                ? "bg-white/10 text-white shadow-sm"
                : "hover:text-gray-300"
            }`}
            aria-pressed={theme === "light"}
            aria-label="Light mode"
          >
            <Sun className="h-4 w-4 shrink-0" strokeWidth={2} />
            <span className="hidden text-xs font-medium md:inline">Light</span>
          </button>
          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-gray-400 transition-colors duration-200 ease-out md:px-3 md:py-2 ${
              theme === "dark"
                ? "theme-accent-text text-white shadow-sm"
                : "hover:text-gray-300"
            }`}
            style={theme === "dark" ? { backgroundColor: accent } : undefined}
            aria-pressed={theme === "dark"}
            aria-label="Dark mode"
          >
            <Moon className="h-4 w-4 shrink-0" strokeWidth={2} />
            <span className="hidden text-xs font-medium md:inline">Dark</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
