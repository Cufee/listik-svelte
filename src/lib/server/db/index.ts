import { env } from "$env/dynamic/private";
import { logger } from "$lib/logger";
import { AppError, type Result } from "$lib/result";

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { ListOperations } from "./lists";
import * as schema from "./schema";
import { SessionOperations } from "./sessions";
import { UserOperations } from "./users";

export type Client = ReturnType<typeof newClient>;

export class Database {
  public db: Client;
  public lists: ListOperations;
  public users: UserOperations;
  public sessions: SessionOperations;

  constructor(db: Client) {
    this.db = db;
    this.lists = new ListOperations(db);
    this.users = new UserOperations(db);
    this.sessions = new SessionOperations(db);
  }
}

export function newClient() {
  if (!env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  const client = createClient({ url: env.DATABASE_URL });
  return drizzle(client, { schema });
}

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
    logger.error(error, errorMessage);
    return {
      ok: false,
      error: new DatabaseError(errorMessage, error),
    };
  }
}
