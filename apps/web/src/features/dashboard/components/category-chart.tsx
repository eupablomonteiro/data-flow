"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryPerformance } from "@dataflow/types";

interface CategoryChartProps {
  data?: CategoryPerformance[];
  isLoading: boolean;
}

const COLORS = [
  "#6366F1",
  "#8B5CF6",
  "#A78BFA",
  "#C4B5FD",
  "#818CF8",
  "#6D28D9",
  "#4F46E5",
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: "compact",
  }).format(value);

export function CategoryChart({ data, isLoading }: CategoryChartProps) {
  const total = data?.reduce((sum, item) => sum + item.total, 0) ?? 0;

  return (
    <div className="rounded-xl bg-df-bg-secondary border border-df-surface/20 p-5">
      <div className="mb-5">
        <h3 className="text-df-white font-semibold text-sm">
          Performance por Categoria
        </h3>
        <p className="text-df-muted text-xs mt-0.5">
          Distribuição de receita por categoria
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[280px]">
          <Skeleton className="w-48 h-48 rounded-full bg-df-surface/20" />
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row items-center flex-wrap gap-6">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
                dataKey="total"
                nameKey="category"
                stroke="none"
              >
                {data?.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#1E293B",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#E2E8F0",
                  fontSize: 12,
                }}
                formatter={(value: any) => [
                  formatCurrency(value as number),
                  "Receita",
                ]}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="flex flex-col gap-2 min-w-[140px]">
            {data?.slice(0, 5).map((item, index) => {
              const percentage =
                total > 0 ? ((item.total / total) * 100).toFixed(1) : "0";
              return (
                <div key={item.category} className="flex items-center gap-2.5">
                  <div
                    className="w-3 h-3 rounded-sm shrink-0"
                    style={{ background: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-df-text text-xs truncate flex-1">
                    {item.category}
                  </span>
                  <span className="text-df-muted text-xs font-medium">
                    {percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
