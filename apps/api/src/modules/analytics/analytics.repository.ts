import { getPrisma } from "@dataflow/database";
import { SalesPerDay } from "@dataflow/types";

export class AnalyticsRepository {
  async getTotalRevenue(userId: string) {
    const result = await getPrisma().sale.aggregate({
      where: {
        upload: { userId },
      },
      _sum: {
        total: true,
      },
    });

    return result._sum.total ?? 0;
  }

  async getTotalSales(userId: string) {
    return getPrisma().sale.count({
      where: {
        upload: { userId },
      },
    });
  }

  async revenueByCountry(userId: string) {
    return getPrisma().sale.groupBy({
      by: ["country"],
      where: {
        upload: { userId },
      },
      _sum: {
        total: true,
      },
    });
  }

  async topProducts(userId: string) {
    return getPrisma().sale.groupBy({
      by: ["product"],
      where: {
        upload: { userId },
      },
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

  async salesPerDay(userId: string): Promise<SalesPerDay[]> {
    return getPrisma().$queryRawUnsafe(
      `
        SELECT DATE(s."date") as date,
        SUM(s."total") as total
        FROM "Sale" s
        INNER JOIN "Upload" u ON s."uploadId" = u."id"
        WHERE u."userId" = $1
        GROUP BY DATE(s."date")
        ORDER BY date ASC
      `,
      userId,
    );
  }

  async categoryPerformance(userId: string) {
    return getPrisma().sale.groupBy({
      by: ["category"],
      where: {
        upload: { userId },
      },
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
