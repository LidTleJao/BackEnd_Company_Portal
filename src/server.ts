import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { AppDataSource } from "./config/db.js";

const PORT = Number(process.env.PORT ?? 4000);
console.log("Decorators:", { exp: true, emit: true });

AppDataSource.initialize()
  .then(() => {
    console.log("✅ PostgreSQL connected (TypeORM DataSource initialized).");
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error during Data Source initialization:", err);
  });
