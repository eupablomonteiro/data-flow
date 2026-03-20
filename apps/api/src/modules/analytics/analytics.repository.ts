import { getPrisma } from "@dataflow/database";
import { SalesPerDay } from "@dataflow/types";

export class AnalyticsRepository {
  async getTotalRevenue() {
    const result = await getPrisma().sale.aggregate({
      _sum: {
        total: true,
      },
    });

    return result._sum.total ?? 0;
  }

  async getTotalSales() {
    return getPrisma().sale.count();
  }

  async revenueByCountry() {
    return getPrisma().sale.groupBy({
      by: ["country"],
      _sum: {
        total: true,
      },
    });
  }

  async topProducts() {
    return getPrisma().sale.groupBy({
      by: ["product"],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: 5,
    });
  }

  async salesPerDay(): Promise<SalesPerDay[]> {
    return getPrisma().$queryRawUnsafe(`
        SELECT DATE("date") as date,
        SUM(total) as total
        FROM "Sale" GROUP BY DATE("date") ORDER BY date ASC
      `);
  }

  async categoryPerformance() {
    return getPrisma().sale.groupBy({
      by: ["category"],
      _sum: {
        total: true,
      },
      orderBy: {
        _sum: {
          total: "desc",
        },
      },
    });
  }
}
