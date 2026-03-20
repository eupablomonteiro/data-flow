import { env } from "@dataflow/config";
import IORedis from "ioredis";

let redis: IORedis | null = null;

export function getRedis() {
  if (!redis) {
    redis = new IORedis({
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      maxRetriesPerRequest: null,
      retryStrategy: (times) => {
        if (times > 5) {
          console.error("Redis Connection failed after retries.");
          return null;
        }

        return Math.min(times * 1000, 5000);
      },
    });

    redis.on("error", (err) => {
      console.error("Redis error: ", err.message);
    });
  }

  return redis;
}

export async function connectRedis() {
  try {
    const redis = getRedis();
    await redis.ping();
    console.log("Redis Connected");
  } catch (error) {
    console.error("Redis Connection Failed:", error);
    throw error;
  }
}
