"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { SalesPerDay } from "@dataflow/types";

interface SalesChartProps {
  data?: SalesPerDay[];
  isLoading: boolean;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: "compact",
  }).format(value);

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
};

export function SalesChart({ data, isLoading }: SalesChartProps) {
  return (
    <div className="rounded-xl bg-df-bg-secondary border border-df-surface/20 p-5">
      <div className="mb-5">
        <h3 className="text-df-white font-semibold text-sm">
          Vendas por Dia
        </h3>
        <p className="text-df-muted text-xs mt-0.5">
          Evolução diária do volume de vendas
        </p>
      </div>

      {isLoading ? (
        <Skeleton className="h-[280px] w-full bg-df-surface/20 rounded-lg" />
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart
            data={data}
            margin={{ top: 5, right: 20, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#94A3B8", fontSize: 11 }}
              tickFormatter={formatDate}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#94A3B8", fontSize: 11 }}
              tickFormatter={(v) => formatCurrency(v)}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "#1E293B",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#E2E8F0",
                fontSize: 12,
              }}
              labelFormatter={(label: any) => formatDate(label as string)}
              formatter={(value: any) => [formatCurrency(value as number), "Total"]}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#6366F1"
              strokeWidth={2}
              fill="url(#salesGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
