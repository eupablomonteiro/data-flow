import { env } from "@dataflow/config";
import { connectDb } from "@dataflow/database";
import { connectRedis } from "@dataflow/queue";
import { app } from "./app";

async function bootstrap() {
  try {
    console.log("Starting application bootstrap...");

    await connectDb();
    await connectRedis();

    const PORT = env.PORT;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Bootstrap failed:", error);
    if (env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
}

bootstrap();
