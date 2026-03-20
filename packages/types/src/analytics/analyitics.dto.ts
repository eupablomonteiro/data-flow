import {
  CategoryPerformance,
  RevenueByCountry,
  SalesPerDay,
  TopProduct,
} from "./analytics.type";

export type AnalyticsResponseDTO = {
  totalRevenue: number;
  totalSales: number;
  revenueByCountry: RevenueByCountry[];
  topProducts: TopProduct[];
  salesPerDay: SalesPerDay[];
  categoryPerformance: CategoryPerformance[];
};
