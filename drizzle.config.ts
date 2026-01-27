import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL || "postgresql://localhost/placeholder";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
