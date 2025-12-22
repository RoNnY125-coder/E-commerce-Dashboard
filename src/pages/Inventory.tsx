import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Package,
  AlertTriangle,
  TrendingDown,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const inventoryData = [
  {
    id: "PRD-001",
    name: "iPhone 15 Pro Max",
    sku: "IPH-15PM-256",
    stock: 45,
    reserved: 12,
    available: 33,
    reorderPoint: 20,
    status: "healthy",
  },
  {
    id: "PRD-002",
    name: "MacBook Air M3",
    sku: "MBA-M3-256",
    stock: 23,
    reserved: 5,
    available: 18,
    reorderPoint: 15,
    status: "healthy",
  },
  {
    id: "PRD-003",
    name: "AirPods Pro",
    sku: "APP-2ND-GEN",
    stock: 120,
    reserved: 25,
    available: 95,
    reorderPoint: 50,
    status: "healthy",
  },
  {
    id: "PRD-004",
    name: "Apple Watch Ultra",
    sku: "AWU-49MM",
    stock: 5,
    reserved: 3,
    available: 2,
    reorderPoint: 10,
    status: "critical",
  },
  {
    id: "PRD-005",
    name: "iPad Pro 12.9\"",
    sku: "IPP-129-M2",
    stock: 0,
    reserved: 0,
    available: 0,
    reorderPoint: 8,
    status: "out_of_stock",
  },
  {
    id: "PRD-006",
    name: "Magic Keyboard",
    sku: "MK-USB-C",
    stock: 67,
    reserved: 10,
    available: 57,
    reorderPoint: 30,
    status: "healthy",
  },
  {
    id: "PRD-007",
    name: "HomePod Mini",
    sku: "HPM-BLACK",
    stock: 8,
    reserved: 2,
    available: 6,
    reorderPoint: 15,
    status: "low",
  },
  {
    id: "PRD-008",
    name: "Apple TV 4K",
    sku: "ATV-4K-128",
    stock: 3,
    reserved: 1,
    available: 2,
    reorderPoint: 10,
    status: "critical",
  },
];

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  healthy: { label: "Healthy", color: "text-success", icon: Package },
  low: { label: "Low Stock", color: "text-warning", icon: TrendingDown },
  critical: { label: "Critical", color: "text-destructive", icon: AlertTriangle },
  out_of_stock: { label: "Out of Stock", color: "text-destructive", icon: AlertTriangle },
};

const summaryCards = [
  { title: "Total Products", value: 156, icon: Package, color: "bg-primary/10 text-primary" },
  { title: "Low Stock Items", value: 12, icon: TrendingDown, color: "bg-warning/10 text-warning" },
  { title: "Out of Stock", value: 3, icon: AlertTriangle, color: "bg-destructive/10 text-destructive" },
  { title: "Pending Orders", value: 28, icon: RefreshCw, color: "bg-chart-3/10 text-chart-3" },
];

const Inventory = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Inventory</h1>
            <p className="text-muted-foreground">
              Monitor stock levels and manage inventory
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync Stock
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Restock Order
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-xl p-5 card-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {card.value}
                  </p>
                </div>
                <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", card.color)}>
                  <card.icon className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Low Stock Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-warning/5 border border-warning/20 rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground">Low Stock Alert</h3>
              <p className="text-sm text-muted-foreground mt-1">
                4 products are running low on stock. Consider restocking Apple Watch Ultra,
                iPad Pro, HomePod Mini, and Apple TV 4K soon.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Inventory Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-xl card-shadow overflow-hidden"
        >
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Stock Levels</h3>
            <p className="text-sm text-muted-foreground">
              Real-time inventory tracking
            </p>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-muted-foreground">Product</TableHead>
                <TableHead className="text-muted-foreground">SKU</TableHead>
                <TableHead className="text-muted-foreground">Total Stock</TableHead>
                <TableHead className="text-muted-foreground">Reserved</TableHead>
                <TableHead className="text-muted-foreground">Available</TableHead>
                <TableHead className="text-muted-foreground">Stock Level</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryData.map((item, index) => {
                const stockPercent =
                  item.reorderPoint > 0
                    ? Math.min((item.available / (item.reorderPoint * 2)) * 100, 100)
                    : 0;
                const statusInfo = statusConfig[item.status];

                return (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.03 }}
                    className="group hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium text-foreground">
                      {item.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-sm">
                      {item.sku}
                    </TableCell>
                    <TableCell className="text-foreground">{item.stock}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.reserved}
                    </TableCell>
                    <TableCell className="font-semibold text-foreground">
                      {item.available}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Progress
                          value={stockPercent}
                          className="h-2 w-20"
                        />
                        <span className="text-sm text-muted-foreground w-12">
                          {Math.round(stockPercent)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "gap-1",
                          item.status === "healthy" &&
                            "bg-success/10 text-success border-success/20",
                          item.status === "low" &&
                            "bg-warning/10 text-warning border-warning/20",
                          (item.status === "critical" ||
                            item.status === "out_of_stock") &&
                            "bg-destructive/10 text-destructive border-destructive/20"
                        )}
                      >
                        <statusInfo.icon className="w-3 h-3" />
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Inventory;
