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
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/api/products.api";
import { ordersApi } from "@/api/orders.api";
import { Loader2 } from "lucide-react";

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  healthy: { label: "Healthy", color: "text-success", icon: Package },
  low: { label: "Low Stock", color: "text-warning", icon: TrendingDown },
  critical: { label: "Critical", color: "text-destructive", icon: AlertTriangle },
  out_of_stock: { label: "Out of Stock", color: "text-destructive", icon: AlertTriangle },
};

const getInventoryStatus = (quantity: number) => {
  if (quantity === 0) return "out_of_stock";
  if (quantity <= 5) return "critical";
  if (quantity <= 15) return "low";
  return "healthy";
};

const Inventory = () => {
  const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['inventory-products'],
    queryFn: () => productsApi.getProducts({ limit: 100 })
  });

  const { data: ordersData, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['inventory-orders'],
    queryFn: () => ordersApi.getOrders({ status: 'PENDING', limit: 1 })
  });

  const products = productsData?.data || [];
  const totalProducts = productsData?.meta?.total || 0;
  const pendingOrdersCount = ordersData?.meta?.total || 0;

  const lowStockCount = products.filter(p => p.quantity > 0 && p.quantity <= 15).length;
  const outOfStockCount = products.filter(p => p.quantity === 0).length;

  const summaryCards = [
    { title: "Total Products", value: totalProducts, icon: Package, color: "bg-primary/10 text-primary" },
    { title: "Low Stock Items", value: lowStockCount, icon: TrendingDown, color: "bg-warning/10 text-warning" },
    { title: "Out of Stock", value: outOfStockCount, icon: AlertTriangle, color: "bg-destructive/10 text-destructive" },
    { title: "Pending Orders", value: pendingOrdersCount, icon: RefreshCw, color: "bg-chart-3/10 text-chart-3" },
  ];
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

        {isLoadingProducts || isLoadingOrders ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
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
                {lowStockCount + outOfStockCount} products are running low or out of stock. Consider restocking soon.
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
              {products.map((item: any, index: number) => {
                const available = item.quantity;
                const reorderPoint = 15;
                const status = getInventoryStatus(available);
                const stockPercent =
                  reorderPoint > 0
                    ? Math.min((available / (reorderPoint * 2)) * 100, 100)
                    : 0;
                const statusInfo = statusConfig[status];

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
                      {item.sku || `SKU-${item.id.slice(0, 4)}`}
                    </TableCell>
                    <TableCell className="text-foreground">{item.quantity}</TableCell>
                    <TableCell className="text-muted-foreground">
                      0
                    </TableCell>
                    <TableCell className="font-semibold text-foreground">
                      {available}
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
                          status === "healthy" &&
                            "bg-success/10 text-success border-success/20",
                          status === "low" &&
                            "bg-warning/10 text-warning border-warning/20",
                          (status === "critical" ||
                            status === "out_of_stock") &&
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
        </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Inventory;
