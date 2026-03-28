import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { CategoryChart } from "@/components/dashboard/CategoryChart";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { DollarSign, ShoppingCart, TrendingUp, Users, Loader2 } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/api/analytics.api';

const Index = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['dashboard-overview', '12months'],
    queryFn: () => analyticsApi.getOverview('12months')
  });

  const overview = analytics?.data || {
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    totalCustomers: 0
  };
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your store performance.
          </p>
        </div>

        {/* KPI Cards */}
        {isLoading ? (
          <div className="h-32 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard
              title="Total Revenue"
              value={overview.totalRevenue}
              prefix="$"
              change={12.5}
              changeLabel="vs last month"
              icon={DollarSign}
              index={0}
              variant="primary"
            />
            <KPICard
              title="Total Orders"
              value={overview.totalOrders}
              change={8.2}
              changeLabel="vs last month"
              icon={ShoppingCart}
              index={1}
            />
            <KPICard
              title="Avg Order Value"
              value={overview.avgOrderValue}
              prefix="$"
              change={15.3}
              changeLabel="vs last month"
              icon={TrendingUp}
              index={2}
              variant="accent"
            />
            <KPICard
              title="Active Customers"
              value={overview.totalCustomers}
              change={-2.4}
              changeLabel="vs last month"
              icon={Users}
              index={3}
            />
          </div>
        )}

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>
          <div>
            <CategoryChart />
          </div>
        </div>

        {/* Sales Chart & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <SalesChart />
          </div>
          <div className="lg:col-span-2">
            <RecentOrders />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
