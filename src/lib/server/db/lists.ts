import type { Result } from "$lib/result";
import { count, eq } from "drizzle-orm";
import { type Client, databaseDo, IncorrectReturnsLength } from ".";
import { type List, listMembers, lists } from "./schema";

export class ListOperations {
  private db: Client;
  constructor(db: Client) {
    this.db = db;
  }

  async ownedByUser(
    userId: string,
  ): Promise<Result<List[]>> {
    const result = await databaseDo(() => {
      return this.db.query.lists.findMany({ where: eq(lists.ownerId, userId) })
        .execute();
    }, "failed to get lists");
    if (!result.ok) {
      return result;
    }
    return result;
  }

  async visibleToUser(
    userId: string,
  ): Promise<Result<List[]>> {
    const rows = await databaseDo(() => {
      return this.db
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

  async visibleToUserCount(
    userId: string,
  ): Promise<Result<number>> {
    const rows = await databaseDo(() => {
      return this.db
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

  async create(
    data: {
      ownerId: string;
      name: string;
      icon?: string;
      color?: string;
      description: string;
    },
  ): Promise<Result<List>> {
    return databaseDo(() => {
      return this.db
        .transaction(async (tx) => {
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
}
