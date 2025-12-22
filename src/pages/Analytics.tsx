import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Calendar, Download, TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { cn } from "@/lib/utils";

const monthlyData = [
  { month: "Jan", revenue: 45000, orders: 420, customers: 156 },
  { month: "Feb", revenue: 52000, orders: 480, customers: 189 },
  { month: "Mar", revenue: 48000, orders: 440, customers: 167 },
  { month: "Apr", revenue: 61000, orders: 560, customers: 234 },
  { month: "May", revenue: 55000, orders: 510, customers: 198 },
  { month: "Jun", revenue: 67000, orders: 620, customers: 267 },
  { month: "Jul", revenue: 72000, orders: 680, customers: 289 },
  { month: "Aug", revenue: 69000, orders: 650, customers: 276 },
  { month: "Sep", revenue: 78000, orders: 720, customers: 312 },
  { month: "Oct", revenue: 85000, orders: 790, customers: 345 },
  { month: "Nov", revenue: 91000, orders: 850, customers: 378 },
  { month: "Dec", revenue: 98000, orders: 920, customers: 412 },
];

const topProducts = [
  { name: "iPhone 15 Pro", sales: 1250, revenue: 1498750 },
  { name: "MacBook Air M3", sales: 890, revenue: 1155100 },
  { name: "AirPods Pro", sales: 2100, revenue: 522900 },
  { name: "iPad Pro", sales: 650, revenue: 714350 },
  { name: "Apple Watch", sales: 980, revenue: 782220 },
];

const trafficSources = [
  { name: "Organic Search", value: 35, color: "hsl(160, 84%, 39%)" },
  { name: "Direct", value: 28, color: "hsl(45, 93%, 47%)" },
  { name: "Social Media", value: 20, color: "hsl(199, 89%, 48%)" },
  { name: "Email", value: 12, color: "hsl(280, 67%, 50%)" },
  { name: "Referral", value: 5, color: "hsl(340, 75%, 55%)" },
];

const metrics = [
  { title: "Total Revenue", value: "$821,000", change: 12.5, icon: DollarSign, positive: true },
  { title: "Total Orders", value: "7,340", change: 8.2, icon: ShoppingCart, positive: true },
  { title: "Active Customers", value: "3,223", change: 15.3, icon: Users, positive: true },
  { title: "Avg Order Value", value: "$112", change: -2.4, icon: Package, positive: false },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.name.toLowerCase().includes("revenue") ? "$" : ""}
            {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground">
              In-depth insights into your store performance
            </p>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="12months">
              <SelectTrigger className="w-40 bg-card">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="12months">Last 12 months</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-xl p-5 card-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <metric.icon className="w-5 h-5 text-primary" />
                </div>
                <div
                  className={cn(
                    "flex items-center gap-1 text-sm font-medium",
                    metric.positive ? "text-success" : "text-destructive"
                  )}
                >
                  {metric.positive ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {metric.positive ? "+" : ""}
                  {metric.change}%
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{metric.value}</p>
              <p className="text-sm text-muted-foreground">{metric.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-xl p-6 card-shadow"
        >
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Revenue & Orders Overview
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(160, 84%, 39%)"
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                  name="Revenue"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card rounded-xl p-6 card-shadow"
          >
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Top Selling Products
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    width={100}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="sales" fill="hsl(160, 84%, 39%)" radius={[0, 4, 4, 0]} name="Sales" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Traffic Sources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-card rounded-xl p-6 card-shadow"
          >
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Traffic Sources
            </h3>
            <div className="flex items-center gap-6">
              <div className="h-48 w-48 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={trafficSources}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {trafficSources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-3">
                {trafficSources.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-foreground">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
