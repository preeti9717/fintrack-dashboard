import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AppProvider } from './context/AppContext.jsx'
import { Sidebar } from './components/Sidebar.jsx'
import { Header } from './components/Header.jsx'
import { Dashboard } from './pages/Dashboard.jsx'
import { Transactions } from './pages/Transactions.jsx'
import { Insights } from './pages/Insights.jsx'

const comingSoonTitles = {
  '/settings': 'Settings',
  '/help': 'Help & Support',
}

function ComingSoon() {
  const { pathname } = useLocation()
  const title = comingSoonTitles[pathname] ?? 'This page'

  return (
    <>
      <Header />
      <div className="p-6 md:p-8 lg:p-10">
        <div className="rounded-xl border border-border-subtle bg-surface p-10 text-center">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <p className="mt-2 text-sm text-muted">
            This page will be available in a future update.
          </p>
        </div>
      </div>
    </>
  )
}

function Shell() {
  return (
    <div className="min-h-screen bg-page text-muted">
      <Sidebar />
      <main className="min-h-screen min-w-0 overflow-auto pl-[72px] md:pl-[240px]">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/settings" element={<ComingSoon />} />
          <Route path="/help" element={<ComingSoon />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </AppProvider>
  )
}
