import { z } from "@dataflow/config";

export const saleSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected date in YYYY-MM-DD format"),
  product: z.string().max(255),
  category: z.string().max(100),
  price: z.coerce.number().positive().max(999999999),
  quantity: z.coerce.number().int().positive().max(99999),
  customer_country: z.string().max(100),
});

export type SaleType = z.infer<typeof saleSchema>;
