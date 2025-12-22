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

const orders = [
  {
    id: "#ORD-7892",
    customer: { name: "John Doe", email: "john@example.com", avatar: "john" },
    product: "iPhone 15 Pro Max",
    amount: 1299,
    status: "completed",
    date: "Dec 20, 2024",
  },
  {
    id: "#ORD-7891",
    customer: { name: "Sarah Smith", email: "sarah@example.com", avatar: "sarah" },
    product: "MacBook Air M3",
    amount: 1499,
    status: "processing",
    date: "Dec 20, 2024",
  },
  {
    id: "#ORD-7890",
    customer: { name: "Mike Johnson", email: "mike@example.com", avatar: "mike" },
    product: "AirPods Pro",
    amount: 249,
    status: "pending",
    date: "Dec 19, 2024",
  },
  {
    id: "#ORD-7889",
    customer: { name: "Emily Brown", email: "emily@example.com", avatar: "emily" },
    product: "iPad Pro 12.9\"",
    amount: 1099,
    status: "completed",
    date: "Dec 19, 2024",
  },
  {
    id: "#ORD-7888",
    customer: { name: "David Wilson", email: "david@example.com", avatar: "david" },
    product: "Apple Watch Ultra",
    amount: 799,
    status: "cancelled",
    date: "Dec 18, 2024",
  },
];

const statusStyles: Record<string, string> = {
  completed: "bg-success/10 text-success border-success/20",
  processing: "bg-primary/10 text-primary border-primary/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

export function RecentOrders() {
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
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </div>

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
          {orders.map((order, index) => (
            <motion.tr
              key={order.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.05 }}
              className="group hover:bg-muted/50 transition-colors"
            >
              <TableCell className="font-medium text-foreground">{order.id}</TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${order.customer.avatar}`}
                    />
                    <AvatarFallback>
                      {order.customer.name
                        .split(" ")
                        .map((n) => n[0])
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
              <TableCell className="text-foreground">{order.product}</TableCell>
              <TableCell className="font-semibold text-foreground">
                ${order.amount.toLocaleString()}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn("capitalize", statusStyles[order.status])}
                >
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{order.date}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}
