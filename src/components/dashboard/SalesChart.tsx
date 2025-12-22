import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", sales: 420 },
  { day: "Tue", sales: 380 },
  { day: "Wed", sales: 560 },
  { day: "Thu", sales: 490 },
  { day: "Fri", sales: 620 },
  { day: "Sat", sales: 750 },
  { day: "Sun", sales: 680 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-sm text-primary font-semibold">
          {payload[0].value} orders
        </p>
      </div>
    );
  }
  return null;
};

export function SalesChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-card rounded-xl p-6 card-shadow"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Weekly Sales</h3>
        <p className="text-sm text-muted-foreground">Order volume by day</p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))" }} />
            <Bar
              dataKey="sales"
              fill="hsl(160, 84%, 39%)"
              radius={[6, 6, 0, 0]}
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
