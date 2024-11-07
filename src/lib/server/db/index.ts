import { env } from "$env/dynamic/private";
import { logger } from "$lib/logger";
import { AppError, type Result } from "$lib/result";

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

if (!env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
const client = createClient({ url: env.DATABASE_URL });
export const db = drizzle(client, { schema });
export type Database = typeof db;

export class DatabaseError extends AppError {
  constructor(message: string, cause?: unknown) {
    super(message, "DATABASE_ERROR", cause);
  }
}

export const IncorrectReturnsLength = new DatabaseError(
  "incorrect number of records returned",
);

// Helper function to handle database operations
export async function databaseDo<T>(
  operation: () => Promise<T>,
  errorMessage: string,
): Promise<Result<T>> {
  try {
    const result = await operation();
    return { ok: true, data: result };
  } catch (error) {
    logger.error(errorMessage, error);
    return {
      ok: false,
      error: new DatabaseError(errorMessage, error),
    };
  }
}
