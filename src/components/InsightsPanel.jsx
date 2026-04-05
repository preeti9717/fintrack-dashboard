import { Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'

const typeConfig = {
  positive: {
    icon: CheckCircle2,
    ring: 'ring-emerald-500/20',
    iconClass: 'text-emerald-400',
  },
  watch: {
    icon: AlertCircle,
    ring: 'ring-amber-500/20',
    iconClass: 'text-amber-400',
  },
}

export function InsightsPanel({ compact }) {
  const { insights } = useApp()
  const items = compact ? insights.slice(0, 2) : insights

  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 text-accent">
          <Sparkles className="h-4 w-4" strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">Insights</h2>
          <p className="text-xs text-muted">Personalized for you</p>
        </div>
      </div>
      <ul className="space-y-3">
        {items.map((item) => {
          const cfg = typeConfig[item.type] ?? typeConfig.positive
          const Icon = cfg.icon
          return (
            <li
              key={item.id}
              className={`flex gap-3 rounded-lg border border-border-subtle bg-page/40 p-3 ring-1 ${cfg.ring}`}
            >
              <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${cfg.iconClass}`} strokeWidth={2} />
              <div>
                <p className="text-sm font-medium text-white">{item.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">{item.body}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
