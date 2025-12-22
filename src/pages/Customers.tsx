import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Search, Mail, MoreVertical, UserPlus } from "lucide-react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const customers = [
  {
    id: "CUS-001",
    name: "John Doe",
    email: "john@example.com",
    avatar: "john",
    orders: 15,
    spent: 12450,
    status: "active",
    joined: "Jan 15, 2024",
  },
  {
    id: "CUS-002",
    name: "Sarah Smith",
    email: "sarah@example.com",
    avatar: "sarah",
    orders: 23,
    spent: 18920,
    status: "active",
    joined: "Feb 3, 2024",
  },
  {
    id: "CUS-003",
    name: "Mike Johnson",
    email: "mike@example.com",
    avatar: "mike",
    orders: 8,
    spent: 3450,
    status: "active",
    joined: "Mar 12, 2024",
  },
  {
    id: "CUS-004",
    name: "Emily Brown",
    email: "emily@example.com",
    avatar: "emily",
    orders: 31,
    spent: 24780,
    status: "vip",
    joined: "Nov 20, 2023",
  },
  {
    id: "CUS-005",
    name: "David Wilson",
    email: "david@example.com",
    avatar: "david",
    orders: 2,
    spent: 899,
    status: "inactive",
    joined: "Dec 5, 2024",
  },
  {
    id: "CUS-006",
    name: "Lisa Anderson",
    email: "lisa@example.com",
    avatar: "lisa",
    orders: 19,
    spent: 15670,
    status: "active",
    joined: "Apr 8, 2024",
  },
];

const statusStyles: Record<string, string> = {
  active: "bg-success/10 text-success border-success/20",
  vip: "bg-accent/20 text-accent-foreground border-accent/40",
  inactive: "bg-muted text-muted-foreground border-border",
};

const Customers = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Customers</h1>
            <p className="text-muted-foreground">Manage your customer base</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Customer
          </Button>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl p-4 card-shadow"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              className="pl-10 bg-secondary border-0"
            />
          </div>
        </motion.div>

        {/* Customers Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl card-shadow overflow-hidden"
        >
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-muted-foreground">Customer</TableHead>
                <TableHead className="text-muted-foreground">Orders</TableHead>
                <TableHead className="text-muted-foreground">Total Spent</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Joined</TableHead>
                <TableHead className="text-muted-foreground w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer, index) => (
                <motion.tr
                  key={customer.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.03 }}
                  className="group hover:bg-muted/50 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${customer.avatar}`}
                        />
                        <AvatarFallback>
                          {customer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">
                          {customer.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {customer.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">{customer.orders}</TableCell>
                  <TableCell className="font-semibold text-foreground">
                    ${customer.spent.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("capitalize", statusStyles[customer.status])}
                    >
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {customer.joined}
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
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="w-4 h-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem>View Orders</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Customers;
