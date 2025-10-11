import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 5433),
  username: process.env.DB_USER ?? "keycloak",
  password: process.env.DB_PASSWORD ?? process.env.DB_PASS ?? "keycloak",
  database: process.env.DB_NAME ?? "company_portal",
  synchronize: true,
  logging: false,
  entities: [path.join(__dirname, "../entities/*.{ts,js}")],
});
