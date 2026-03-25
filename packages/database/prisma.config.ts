import { defineConfig } from "@prisma/config";
import { env } from "@dataflow/config";

export default defineConfig({
  schema: "./prisma/schema.prisma",

  datasource: {
    url: env.DATABASE_URL,
  },

  migrations: {
    path: "./prisma/migrations",
  },
});
