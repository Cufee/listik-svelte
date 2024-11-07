import type { Result } from "$lib/result";
import { databaseDo, DatabaseError, db, IncorrectReturnsLength } from ".";
import { type User, users } from "./schema";

export async function findUserByExternalId(id: string): Promise<Result<User>> {
  const user = await databaseDo(() => {
    return db.query.users.findFirst({
      where: (table, { eq }) => eq(table.externalId, id),
    }).execute();
  }, "failed to find a user");
  if (!user.ok) {
    return user;
  }
  if (!user.data) {
    return { ok: false, error: new DatabaseError("user not found") };
  }
  return { ok: true, data: user.data };
}

export async function createUser(
  data: typeof users.$inferInsert,
): Promise<Result<User>> {
  const result = await databaseDo(() => {
    return db.insert(users).values(data).returning().execute();
  }, "failed to insert user record");
  if (!result.ok) {
    return result;
  }
  if (result.data.length !== 1) {
    return {
      ok: false,
      error: IncorrectReturnsLength,
    };
  }
  return { ok: true, data: result.data[0] };
}
