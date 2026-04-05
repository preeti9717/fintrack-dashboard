import { Header } from "../components/Header.jsx";
import { SummaryCards } from "../components/SummaryCards.jsx";
import { BalanceTrendChart } from "../components/charts/BalanceTrendChart.jsx";
import { SpendingDonutChart } from "../components/charts/SpendingDonutChart.jsx";
import { RecentTransactionsPreview } from "../components/RecentTransactionsPreview.jsx";
import { SavingsGoals } from "../components/SavingsGoals.jsx";

export function Dashboard() {
  return (
    <>
      <Header />
      <div className="page-fade-in min-h-[calc(100vh-1px)] bg-page px-4 py-6 sm:px-6 md:px-8 md:py-8 lg:px-10 lg:py-10">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="flex flex-col gap-6 lg:col-span-2 lg:gap-8">
            <SummaryCards />
            <BalanceTrendChart />
            <RecentTransactionsPreview />
          </div>

          <div className="flex flex-col gap-6 lg:col-span-1 lg:gap-8">
            <SpendingDonutChart />
            <SavingsGoals />
          </div>
        </div>
      </div>
    </>
  );
}
