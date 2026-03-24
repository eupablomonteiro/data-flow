"use client";

import { DollarSign, ShoppingCart, Upload, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

interface KPICardsProps {
  totalRevenue?: number;
  totalSales?: number;
  uploadsCount?: number;
  isLoading: boolean;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("pt-BR").format(value);
};

const cards = [
  {
    title: "Receita Total",
    icon: DollarSign,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    borderColor: "border-emerald-400/20",
    getValue: (props: KPICardsProps) =>
      props.totalRevenue !== undefined ? formatCurrency(props.totalRevenue) : "—",
  },
  {
    title: "Total de Vendas",
    icon: ShoppingCart,
    color: "text-df-accent-light",
    bgColor: "bg-df-accent/10",
    borderColor: "border-df-accent/20",
    getValue: (props: KPICardsProps) =>
      props.totalSales !== undefined ? formatNumber(props.totalSales) : "—",
  },
  {
    title: "Uploads Realizados",
    icon: Upload,
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
    borderColor: "border-amber-400/20",
    getValue: (props: KPICardsProps) =>
      props.uploadsCount !== undefined ? formatNumber(props.uploadsCount) : "—",
  },
  {
    title: "Performance",
    icon: TrendingUp,
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
    borderColor: "border-cyan-400/20",
    getValue: () => "99.9%",
    subtitle: "Uptime",
  },
];

export function KPICards(props: KPICardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08, duration: 0.4 }}
          className={`relative overflow-hidden rounded-xl bg-df-bg-secondary border ${card.borderColor} p-5 transition-all hover:shadow-lg hover:shadow-df-accent/5`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-df-muted text-xs font-medium uppercase tracking-wider">
              {card.title}
            </span>
            <div
              className={`w-8 h-8 ${card.bgColor} rounded-lg flex items-center justify-center`}
            >
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
          </div>

          {props.isLoading ? (
            <Skeleton className="h-8 w-32 bg-df-surface/30" />
          ) : (
            <p className="text-df-white text-2xl font-bold tracking-tight">
              {card.getValue(props)}
            </p>
          )}

          {card.subtitle && !props.isLoading && (
            <p className="text-df-muted text-xs mt-1">{card.subtitle}</p>
          )}

          {/* Decorative gradient */}
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-linear-to-tl from-df-accent/5 to-transparent pointer-events-none" />
        </motion.div>
      ))}
    </div>
  );
}
