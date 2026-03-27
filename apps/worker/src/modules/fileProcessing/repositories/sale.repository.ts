import { getPrisma } from "@dataflow/database";
import { SaleType } from "@dataflow/validation";

export class SaleRepository {
  async createMany(rows: SaleType[], uploadId: string) {
    if (!rows.length) return;

    const data = rows.map((row) => ({
      date: new Date(row.date),
      product: row.product,
      category: row.category,
      price: row.price,
      quantity: row.quantity,
      country: row.customer_country,
      total: row.price * row.quantity,
      uploadId,
    }));

    await getPrisma().sale.createMany({
      data,
    });
  }
}
