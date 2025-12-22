import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  MoreVertical,
  Grid,
  List,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

const products = [
  {
    id: "PRD-001",
    name: "iPhone 15 Pro Max",
    category: "Electronics",
    price: 1199,
    stock: 45,
    status: "active",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=100&h=100&fit=crop",
  },
  {
    id: "PRD-002",
    name: "MacBook Air M3",
    category: "Electronics",
    price: 1299,
    stock: 23,
    status: "active",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop",
  },
  {
    id: "PRD-003",
    name: "AirPods Pro",
    category: "Accessories",
    price: 249,
    stock: 120,
    status: "active",
    image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=100&h=100&fit=crop",
  },
  {
    id: "PRD-004",
    name: "Apple Watch Ultra",
    category: "Wearables",
    price: 799,
    stock: 5,
    status: "low_stock",
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=100&h=100&fit=crop",
  },
  {
    id: "PRD-005",
    name: "iPad Pro 12.9\"",
    category: "Electronics",
    price: 1099,
    stock: 0,
    status: "out_of_stock",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=100&h=100&fit=crop",
  },
  {
    id: "PRD-006",
    name: "Magic Keyboard",
    category: "Accessories",
    price: 299,
    stock: 67,
    status: "active",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=100&h=100&fit=crop",
  },
  {
    id: "PRD-007",
    name: "HomePod Mini",
    category: "Smart Home",
    price: 99,
    stock: 89,
    status: "active",
    image: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=100&h=100&fit=crop",
  },
  {
    id: "PRD-008",
    name: "Apple TV 4K",
    category: "Smart Home",
    price: 179,
    stock: 3,
    status: "low_stock",
    image: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=100&h=100&fit=crop",
  },
];

const statusStyles: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-success/10 text-success border-success/20" },
  low_stock: { label: "Low Stock", className: "bg-warning/10 text-warning border-warning/20" },
  out_of_stock: { label: "Out of Stock", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const Products = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Products</h1>
            <p className="text-muted-foreground">Manage your product catalog</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl p-4 card-shadow flex flex-col sm:flex-row gap-4 items-center"
        >
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-10 bg-secondary border-0"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Products Table */}
        {viewMode === "list" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-xl card-shadow overflow-hidden"
          >
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Product</TableHead>
                  <TableHead className="text-muted-foreground">Category</TableHead>
                  <TableHead className="text-muted-foreground">Price</TableHead>
                  <TableHead className="text-muted-foreground">Stock</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.03 }}
                    className="group hover:bg-muted/50 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {product.id}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">
                      {product.category}
                    </TableCell>
                    <TableCell className="font-semibold text-foreground">
                      ${product.price.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "font-medium",
                          product.stock === 0
                            ? "text-destructive"
                            : product.stock <= 5
                            ? "text-warning"
                            : "text-foreground"
                        )}
                      >
                        {product.stock} units
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={statusStyles[product.status].className}
                      >
                        {statusStyles[product.status].label}
                      </Badge>
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
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit Product
                          </DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Product
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-xl card-shadow overflow-hidden group hover:card-shadow-lg transition-all"
              >
                <div className="aspect-square bg-muted overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <Badge
                    variant="outline"
                    className={cn("mb-2", statusStyles[product.status].className)}
                  >
                    {statusStyles[product.status].label}
                  </Badge>
                  <h3 className="font-semibold text-foreground mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {product.category}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-foreground">
                      ${product.price}
                    </span>
                    <span
                      className={cn(
                        "text-sm",
                        product.stock === 0
                          ? "text-destructive"
                          : product.stock <= 5
                          ? "text-warning"
                          : "text-muted-foreground"
                      )}
                    >
                      {product.stock} in stock
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Products;
