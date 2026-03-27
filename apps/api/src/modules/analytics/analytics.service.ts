import { AnalyticsRepository } from "./analytics.repository";
import { AnalyticsResponseDTO } from "@dataflow/types";

export class AnalyticsService {
  constructor(private repo = new AnalyticsRepository()) {}

  async execute(userId: string): Promise<AnalyticsResponseDTO> {
    const [
      totalRevenue,
      totalSales,
      revenueByCountry,
      topProducts,
      salesPerDay,
      categoryPerformance,
    ] = await Promise.all([
      this.repo.getTotalRevenue(userId),
      this.repo.getTotalSales(userId),
      this.repo.revenueByCountry(userId),
      this.repo.topProducts(userId),
      this.repo.salesPerDay(userId),
      this.repo.categoryPerformance(userId),
    ]);

    return {
      totalRevenue,
      totalSales,

      revenueByCountry: revenueByCountry.map((item) => ({
        country: item.country,
        total: item._sum.total ?? 0,
      })),

      topProducts: topProducts.map((item) => ({
        product: item.product,
        quantity: item._sum.quantity ?? 0,
      })),

      salesPerDay: salesPerDay.map((item) => ({
        date: item.date,
        total: item.total ?? 0,
      })),

      categoryPerformance: categoryPerformance.map((item) => ({
        category: item.category,
        total: item._sum.total ?? 0,
      })),
    };
  }
}
