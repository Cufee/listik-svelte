import { env } from "$env/dynamic/private";
import { logger } from "$lib/logger";
import type { Result } from "$lib/result";
import { Database as DB } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "./schema";

if (!env.DB_FILE_NAME) throw new Error("DB_FILE_NAME is not set");
const sqlite = new DB(process.env.DB_FILE_NAME!);
export const db = drizzle(sqlite, { schema });
export type Database = typeof db;

// Helper function to handle database operations
export async function databaseDo<T>(
  operation: () => Promise<T>,
  errorMessage: string,
): Promise<Result<T>> {
  try {
    const result = await operation();
    return { ok: true, data: result };
  } catch (error) {
    logger.error(errorMessage, { error });
    return {
      ok: false,
      message: errorMessage,
      error,
    };
  }
}
