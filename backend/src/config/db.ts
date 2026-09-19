import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is missing ❌");
}

export const pool = new Pool({
  connectionString: DATABASE_URL,
});

// test simple
pool.query("SELECT 1")
  .then(() => {
    console.log("Base de donnée connectée avec succès ✅");
  })
  .catch((err) => {
    console.error("Erreur de connexion DB ❌", err.message);
    process.exit(1);
  });

  