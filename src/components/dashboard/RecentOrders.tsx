import { motion } from "framer-motion";
import { Eye, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "@/api/orders.api";
import { Link } from "react-router-dom";

const statusStyles: Record<string, string> = {
  COMPLETED: "bg-success/10 text-success border-success/20",
  PROCESSING: "bg-primary/10 text-primary border-primary/20",
  PENDING: "bg-warning/10 text-warning border-warning/20",
  DELIVERED: "bg-success/10 text-success border-success/20",
  SHIPPED: "bg-primary/10 text-primary border-primary/20",
  CANCELLED: "bg-destructive/10 text-destructive border-destructive/20",
  REFUNDED: "bg-destructive/10 text-destructive border-destructive/20",
};

export function RecentOrders() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['recent-orders'],
    queryFn: () => ordersApi.getOrders({ limit: 5 })
  });

  const orders = response?.data || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="bg-card rounded-xl card-shadow"
    >
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Recent Orders</h3>
            <p className="text-sm text-muted-foreground">Latest customer transactions</p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/orders">View All</Link>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-muted-foreground">Order</TableHead>
            <TableHead className="text-muted-foreground">Customer</TableHead>
            <TableHead className="text-muted-foreground">Product</TableHead>
            <TableHead className="text-muted-foreground">Amount</TableHead>
            <TableHead className="text-muted-foreground">Status</TableHead>
            <TableHead className="text-muted-foreground">Date</TableHead>
            <TableHead className="text-muted-foreground w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order: any, index: number) => (
            <motion.tr
              key={order.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.05 }}
              className="group hover:bg-muted/50 transition-colors"
            >
              <TableCell className="font-medium text-foreground">#{order.order_number}</TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={order.customer.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${order.customer.name}`}
                    />
                    <AvatarFallback>
                      {order.customer.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {order.customer.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.customer.email}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-foreground">{order.items?.[0]?.product_name || 'N/A'}</TableCell>
              <TableCell className="font-semibold text-foreground">
                ${Number(order.total).toLocaleString()}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn("capitalize", statusStyles[order.status])}
                >
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(order.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  asChild
                >
                  <Link to="/orders">
                    <Eye className="w-4 h-4" />
                  </Link>
                </Button>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
      )}
    </motion.div>
  );
}
