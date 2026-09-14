import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",

  schemaFilter: ["flowcrm"],

  migrations: {
    schema: "drizzle_flowcrm",
    table: "__drizzle_migrations",
  },

  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});