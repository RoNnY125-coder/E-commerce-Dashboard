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
  Loader2,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "@/api/orders.api";
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
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const statusStyles: Record<string, string> = {
  COMPLETED: "bg-success/10 text-success border-success/20",
  PROCESSING: "bg-primary/10 text-primary border-primary/20",
  PENDING: "bg-warning/10 text-warning border-warning/20",
  DELIVERED: "bg-success/10 text-success border-success/20",
  SHIPPED: "bg-primary/10 text-primary border-primary/20",
  CANCELLED: "bg-destructive/10 text-destructive border-destructive/20",
  REFUNDED: "bg-destructive/10 text-destructive border-destructive/20",
};

const paymentStyles: Record<string, string> = {
  PAID: "bg-success/10 text-success border-success/20",
  PENDING: "bg-warning/10 text-warning border-warning/20",
  REFUNDED: "bg-muted text-muted-foreground border-border",
};

const ORDER_STATUSES = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
];

const Orders = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data: response, isLoading } = useQuery({
    queryKey: ['orders', currentPage, statusFilter, searchTerm],
    queryFn: () => ordersApi.getOrders({
      page: currentPage,
      limit: pageSize,
      status: statusFilter === 'all' ? undefined : statusFilter.toUpperCase(),
      search: searchTerm || undefined
    })
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      ordersApi.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order status updated");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update status");
    },
  });

  const handleUpdateStatus = (id: string, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  const orders = response?.data || [];
  const meta = response?.meta || { total: 0, pages: 1 };

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px] bg-secondary border-0">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="secondary">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </motion.div>

        {isLoading ? (
          <div className="p-12 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl card-shadow overflow-hidden"
        >
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent px-4">
                <TableHead className="text-muted-foreground pl-6">Order ID</TableHead>
                <TableHead className="text-muted-foreground">Customer</TableHead>
                <TableHead className="text-muted-foreground">Items</TableHead>
                <TableHead className="text-muted-foreground">Total</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Payment</TableHead>
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
                  transition={{ delay: 0.2 + index * 0.03 }}
                  className="group hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="font-medium text-foreground pl-6">
                    #{order.order_number}
                  </TableCell>
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
                  <TableCell>
                    <div className="max-w-[200px]">
                      <p className="text-sm text-foreground truncate">
                        {order.items?.[0]?.product_name || 'N/A'}
                      </p>
                      {order.items?.length > 1 && (
                        <p className="text-xs text-muted-foreground">
                          +{order.items.length - 1} more
                        </p>
                      )}
                    </div>
                  </TableCell>
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
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("capitalize", paymentStyles[order.payment_status])}
                    >
                      {order.payment_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
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
                        
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            Update Status
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent>
                            {ORDER_STATUSES.map((status) => (
                              <DropdownMenuItem
                                key={status}
                                onClick={() => handleUpdateStatus(order.id, status)}
                                className={cn(
                                  "capitalize",
                                  order.status === status && "bg-accent"
                                )}
                              >
                                {status.toLowerCase()}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>

                        <DropdownMenuItem>Print Invoice</DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleUpdateStatus(order.id, "CANCELLED")}
                        >
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
              Showing {orders.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}-
              {Math.min(currentPage * pageSize, meta.total)} of {meta.total} orders
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
              {Array.from({ length: meta.pages }, (_, i) => i + 1).map((page) => (
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
                disabled={currentPage === meta.pages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
        </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Orders;
