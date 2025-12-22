import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Electronics", value: 35, color: "hsl(160, 84%, 39%)" },
  { name: "Clothing", value: 25, color: "hsl(45, 93%, 47%)" },
  { name: "Home & Garden", value: 20, color: "hsl(199, 89%, 48%)" },
  { name: "Sports", value: 12, color: "hsl(280, 67%, 50%)" },
  { name: "Other", value: 8, color: "hsl(340, 75%, 55%)" },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground">{payload[0].name}</p>
        <p className="text-sm text-muted-foreground">{payload[0].value}% of revenue</p>
      </div>
    );
  }
  return null;
};

export function CategoryChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-card rounded-xl p-6 card-shadow"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Revenue by Category</h3>
        <p className="text-sm text-muted-foreground">Distribution of sales</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="h-48 w-48 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-3">
          {data.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-foreground">{item.name}</span>
              </div>
              <span className="text-sm font-medium text-foreground">{item.value}%</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
