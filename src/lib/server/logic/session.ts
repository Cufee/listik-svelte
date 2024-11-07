import type { Result } from "$lib/result";
import { createHash, randomBytes } from "crypto";
import type { Database } from "../db";
import type { Session } from "../db/schema";

export async function newSession(
  db: Database,
  userId: string,
  identifier: string,
): Promise<Result<Session>> {
  const hash = createHash("sha256");
  const salt = randomBytes(16).toString("hex");
  hash.update(`session-${userId}-${Date.now()}-${salt}`);
  const cookie = hash.digest("hex");

  const session = await db.sessions.create(userId, identifier, cookie);
  if (!session.ok) {
    return session;
  }
  return session;
}
