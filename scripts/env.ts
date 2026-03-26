import "dotenv/config";
import { databaseEnvSchema, redisEnvSchema } from "@dataflow/config";

export function validateEnv() {
  const dbResult = databaseEnvSchema.safeParse(process.env);
  const redisResult = redisEnvSchema.safeParse(process.env);

  if (!dbResult.success || !redisResult.success) {
    if (!dbResult.success) console.error("DATABASE env errors:", dbResult.error.format());
    if (!redisResult.success) console.error("REDIS env errors:", redisResult.error.format());
    process.exit(1);
  }

  return { ...dbResult.data, ...redisResult.data };
}
