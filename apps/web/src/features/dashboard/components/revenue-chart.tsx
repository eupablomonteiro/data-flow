"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { RevenueByCountry } from "@dataflow/types";

interface RevenueChartProps {
  data?: RevenueByCountry[];
  isLoading: boolean;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: "compact",
  }).format(value);

export function RevenueChart({ data, isLoading }: RevenueChartProps) {
  return (
    <div className="rounded-xl bg-df-bg-secondary border border-df-surface/20 p-5">
      <div className="mb-5">
        <h3 className="text-df-white font-semibold text-sm">
          Receita por País
        </h3>
        <p className="text-df-muted text-xs mt-0.5">
          Visualização de receita gerada por país de origem
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-6 bg-df-surface/20" style={{ width: `${100 - i * 15}%` }} />
          ))}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={data?.slice(0, 8)}
            layout="vertical"
            margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={{ fill: "#94A3B8", fontSize: 11 }}
              tickFormatter={(v) => formatCurrency(v)}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              dataKey="country"
              type="category"
              tick={{ fill: "#CBD5E1", fontSize: 11 }}
              width={80}
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
              formatter={(value: any) => [formatCurrency(value as number), "Receita"]}
            />
            <Bar
              dataKey="total"
              fill="#6366F1"
              radius={[0, 6, 6, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
