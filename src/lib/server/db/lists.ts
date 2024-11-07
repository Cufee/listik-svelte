import type { Result } from "$lib/result";
import { count, eq } from "drizzle-orm";
import { databaseDo, db, IncorrectReturnsLength } from ".";
import { type List, listMembers, lists } from "./schema";

export async function getUserOwnedLists(
  userId: string,
): Promise<Result<List[]>> {
  const result = await databaseDo(() => {
    return db.query.lists.findMany({ where: eq(lists.ownerId, userId) })
      .execute();
  }, "failed to get lists");
  if (!result.ok) {
    return result;
  }
  return result;
}

export async function getUserLists(
  userId: string,
): Promise<Result<List[]>> {
  const rows = await databaseDo(() => {
    return db
      .select({ list: lists })
      .from(listMembers)
      .leftJoin(lists, eq(listMembers.listId, lists.id))
      .where(eq(listMembers.userId, userId))
      .all();
  }, "failed to get lists");
  if (!rows.ok) {
    return rows;
  }

  const result: List[] = [];
  for (const row of rows.data) {
    if (!row.list) continue;
    result.push(row.list);
  }
  return { ok: true, data: result };
}

export async function countUserLists(
  userId: string,
): Promise<Result<number>> {
  const rows = await databaseDo(() => {
    return db
      .select({ count: count() })
      .from(listMembers)
      .where(eq(listMembers.userId, userId));
  }, "failed to count list_members");
  if (!rows.ok) {
    return rows;
  }

  let total = 0;
  for (const row of rows.data) {
    total += row.count;
  }
  return { ok: true, data: total };
}

export function createNewList(
  data: { ownerId: string; name: string; description: string },
): Promise<Result<List>> {
  return databaseDo(() => {
    return db.transaction(async (tx) => {
      const inserted = await tx
        .insert(lists)
        .values(data)
        .returning()
        .execute();
      if (inserted.length !== 1) {
        throw IncorrectReturnsLength;
      }

      const list = inserted[0];
      await tx
        .insert(listMembers)
        .values({
          userId: list.ownerId,
          listId: list.id,
        })
        .execute();
      return list;
    });
  }, "failed to insert into lists or list_members");
}
