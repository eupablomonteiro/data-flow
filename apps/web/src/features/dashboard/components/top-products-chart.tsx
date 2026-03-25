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
import { TopProduct } from "@dataflow/types";

interface TopProductsChartProps {
  data?: TopProduct[];
  isLoading: boolean;
}

export function TopProductsChart({ data, isLoading }: TopProductsChartProps) {
  return (
    <div className="rounded-xl bg-df-bg-secondary border border-df-surface/20 p-5">
      <div className="mb-5">
        <h3 className="text-df-white font-semibold text-sm">
          Top Produtos
        </h3>
        <p className="text-df-muted text-xs mt-0.5">
          Produtos mais vendidos por quantidade
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-6 bg-df-surface/20" style={{ width: `${100 - i * 12}%` }} />
          ))}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={data}
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
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              dataKey="product"
              type="category"
              tick={{ fill: "#CBD5E1", fontSize: 11 }}
              width={100}
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
              formatter={(value: unknown) => [
                new Intl.NumberFormat("pt-BR").format(Number(value ?? 0)),
                "Quantidade",
              ]}
            />
            <Bar
              dataKey="quantity"
              fill="#8B5CF6"
              radius={[0, 6, 6, 0]}
              barSize={18}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
