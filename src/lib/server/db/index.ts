import { drizzle } from "drizzle-orm/bun-sqlite";
import { env } from "$env/dynamic/private";
import { Database } from "bun:sqlite";

if (!env.DB_FILE_NAME) throw new Error("DB_FILE_NAME is not set");
const sqlite = new Database(process.env.DB_FILE_NAME!);
export const db = drizzle(sqlite);
