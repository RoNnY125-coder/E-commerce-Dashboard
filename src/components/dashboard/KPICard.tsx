import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  change: number;
  changeLabel: string;
  icon: LucideIcon;
  index?: number;
  variant?: "default" | "primary" | "accent";
}

export function KPICard({
  title,
  value,
  prefix = "",
  suffix = "",
  change,
  changeLabel,
  icon: Icon,
  index = 0,
  variant = "default",
}: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const isPositive = change >= 0;

  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const stepDuration = duration / steps;
    const stepValue = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(value, Math.round(stepValue * step));
      setDisplayValue(current);
      if (step >= steps) {
        clearInterval(timer);
        setDisplayValue(value);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value]);

  const formatValue = (val: number) => {
    if (val >= 1000000) {
      return (val / 1000000).toFixed(2) + "M";
    }
    if (val >= 1000) {
      return (val / 1000).toFixed(1) + "K";
    }
    return val.toLocaleString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        "relative overflow-hidden rounded-xl p-6 card-shadow transition-all duration-300 hover:card-shadow-lg",
        variant === "primary" && "bg-primary text-primary-foreground",
        variant === "accent" && "bg-accent text-accent-foreground",
        variant === "default" && "bg-card text-card-foreground"
      )}
    >
      {/* Background decoration */}
      <div
        className={cn(
          "absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10",
          variant === "primary" && "bg-primary-foreground",
          variant === "accent" && "bg-accent-foreground",
          variant === "default" && "bg-primary"
        )}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span
            className={cn(
              "text-sm font-medium",
              variant === "default" && "text-muted-foreground"
            )}
          >
            {title}
          </span>
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              variant === "primary" && "bg-primary-foreground/20",
              variant === "accent" && "bg-accent-foreground/20",
              variant === "default" && "bg-primary/10"
            )}
          >
            <Icon
              className={cn(
                "w-5 h-5",
                variant === "default" && "text-primary"
              )}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold tracking-tight">
              {prefix}
              {formatValue(displayValue)}
            </span>
            {suffix && (
              <span className="text-lg font-medium opacity-70">{suffix}</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                isPositive
                  ? "bg-success/20 text-success"
                  : "bg-destructive/20 text-destructive"
              )}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {isPositive ? "+" : ""}
              {change}%
            </div>
            <span
              className={cn(
                "text-sm",
                variant === "default" ? "text-muted-foreground" : "opacity-70"
              )}
            >
              {changeLabel}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
