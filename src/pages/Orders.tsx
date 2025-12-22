import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Search,
  Filter,
  Download,
  Eye,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const orders = [
  {
    id: "#ORD-7892",
    customer: { name: "John Doe", email: "john@example.com", avatar: "john" },
    products: ["iPhone 15 Pro Max", "AirPods Pro"],
    amount: 1548,
    status: "completed",
    payment: "paid",
    date: "Dec 20, 2024",
  },
  {
    id: "#ORD-7891",
    customer: { name: "Sarah Smith", email: "sarah@example.com", avatar: "sarah" },
    products: ["MacBook Air M3"],
    amount: 1499,
    status: "processing",
    payment: "paid",
    date: "Dec 20, 2024",
  },
  {
    id: "#ORD-7890",
    customer: { name: "Mike Johnson", email: "mike@example.com", avatar: "mike" },
    products: ["AirPods Pro", "Apple Watch Band"],
    amount: 298,
    status: "pending",
    payment: "pending",
    date: "Dec 19, 2024",
  },
  {
    id: "#ORD-7889",
    customer: { name: "Emily Brown", email: "emily@example.com", avatar: "emily" },
    products: ["iPad Pro 12.9\"", "Magic Keyboard"],
    amount: 1448,
    status: "completed",
    payment: "paid",
    date: "Dec 19, 2024",
  },
  {
    id: "#ORD-7888",
    customer: { name: "David Wilson", email: "david@example.com", avatar: "david" },
    products: ["Apple Watch Ultra"],
    amount: 799,
    status: "cancelled",
    payment: "refunded",
    date: "Dec 18, 2024",
  },
  {
    id: "#ORD-7887",
    customer: { name: "Lisa Anderson", email: "lisa@example.com", avatar: "lisa" },
    products: ["iPhone 15", "MagSafe Charger"],
    amount: 948,
    status: "shipped",
    payment: "paid",
    date: "Dec 18, 2024",
  },
  {
    id: "#ORD-7886",
    customer: { name: "James Taylor", email: "james@example.com", avatar: "james" },
    products: ["MacBook Pro 14\""],
    amount: 2499,
    status: "processing",
    payment: "paid",
    date: "Dec 17, 2024",
  },
  {
    id: "#ORD-7885",
    customer: { name: "Jessica Martinez", email: "jessica@example.com", avatar: "jessica" },
    products: ["iPad Air", "Apple Pencil"],
    amount: 798,
    status: "completed",
    payment: "paid",
    date: "Dec 17, 2024",
  },
];

const statusStyles: Record<string, string> = {
  completed: "bg-success/10 text-success border-success/20",
  processing: "bg-primary/10 text-primary border-primary/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  shipped: "bg-chart-3/10 text-chart-3 border-chart-3/20",
};

const paymentStyles: Record<string, string> = {
  paid: "bg-success/10 text-success border-success/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  refunded: "bg-muted text-muted-foreground border-border",
};

const Orders = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Orders</h1>
            <p className="text-muted-foreground">Manage and track customer orders</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Download className="w-4 h-4 mr-2" />
            Export Orders
          </Button>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl p-4 card-shadow flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              className="pl-10 bg-secondary border-0"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40 bg-secondary border-0">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            More Filters
          </Button>
        </motion.div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl card-shadow overflow-hidden"
        >
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-muted-foreground">Order ID</TableHead>
                <TableHead className="text-muted-foreground">Customer</TableHead>
                <TableHead className="text-muted-foreground">Products</TableHead>
                <TableHead className="text-muted-foreground">Amount</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Payment</TableHead>
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
                  transition={{ delay: 0.2 + index * 0.03 }}
                  className="group hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="font-medium text-foreground">
                    {order.id}
                  </TableCell>
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
                  <TableCell>
                    <div className="max-w-[200px]">
                      <p className="text-sm text-foreground truncate">
                        {order.products[0]}
                      </p>
                      {order.products.length > 1 && (
                        <p className="text-xs text-muted-foreground">
                          +{order.products.length - 1} more
                        </p>
                      )}
                    </div>
                  </TableCell>
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
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("capitalize", paymentStyles[order.payment])}
                    >
                      {order.payment}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {order.date}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>Update Status</DropdownMenuItem>
                        <DropdownMenuItem>Print Invoice</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Cancel Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing 1-8 of 156 orders
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {[1, 2, 3, 4, 5].map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "w-8",
                    currentPage === page && "bg-primary hover:bg-primary/90"
                  )}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Orders;
