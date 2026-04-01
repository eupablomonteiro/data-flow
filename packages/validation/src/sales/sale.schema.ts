import { z } from "@dataflow/config";

export const saleSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected date in YYYY-MM-DD format"),
  product: z.string().min(1).max(255).trim(),
  category: z.string().min(1).max(100).trim(),
  price: z.coerce.number().positive().max(999999999),
  quantity: z.coerce.number().int().positive().max(99999),
  customer_country: z.string().min(1).max(100).trim(),
});

export type SaleType = z.infer<typeof saleSchema>;
