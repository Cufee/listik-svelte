import type { Result } from "$lib/result";
import { and, count, eq } from "drizzle-orm";
import {
  type Client,
  databaseDo,
  DatabaseError,
  IncorrectReturnsLength,
} from ".";
import {
  type List,
  type ListItem,
  listItems,
  type ListMember,
  listMembers,
  lists,
  type ListTag,
  listTags,
} from "./schema";

export interface ListTagData {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

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

  async member(
    userId: string,
    listId: string,
  ): Promise<Result<ListMember>> {
    const member = await databaseDo(() => {
      return this.db.query.listMembers.findFirst({
        where: and(
          eq(listMembers.userId, userId),
          eq(listMembers.listId, listId),
        ),
      });
    }, "failed to get from list_members");
    if (!member.ok) {
      return member;
    }
    if (!member.data) {
      return { ok: false, error: new DatabaseError("not found") };
    }
    return { ok: true, data: member.data };
  }

  async get(
    listId: string,
    include: { items?: true; tags?: true } = {},
  ): Promise<Result<List & { items: ListItem[]; tags: ListTag[] }>> {
    const list = await databaseDo(() => {
      return this.db.query.lists.findFirst({
        where: eq(lists.id, listId),
        with: include,
      });
    }, "failed to get from lists");
    if (!list.ok) {
      return list;
    }
    if (!list.data) {
      return { ok: false, error: new DatabaseError("not found") };
    }

    list.data.tags = list.data.tags ?? [];
    list.data.items = list.data.items ?? [];
    return { ok: true, data: list.data as any };
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

  async createTag(
    userId: string,
    listId: string,
    data: ListTagData,
  ): Promise<Result<ListTag>> {
    const inserted = await databaseDo(() => {
      return this.db
        .insert(listTags)
        .values({ ...data, listId, createdBy: userId })
        .returning()
        .execute();
    }, "failed to insert into list_tags");
    if (!inserted.ok) {
      return inserted;
    }
    if (inserted.data.length !== 1) {
      return { ok: false, error: IncorrectReturnsLength };
    }
    return { ok: true, data: inserted.data[0] };
  }

  async updateTag(
    id: string,
    data: Partial<ListTagData>,
  ): Promise<Result<ListTag>> {
    const updated = await databaseDo(() => {
      return this.db
        .update(listTags)
        .set(data)
        .where(eq(listTags.id, id))
        .returning()
        .execute();
    }, "failed to insert into list_tags");
    if (!updated.ok) {
      return updated;
    }
    if (updated.data.length !== 1) {
      return { ok: false, error: IncorrectReturnsLength };
    }
    return { ok: true, data: updated.data[0] };
  }

  async deleteTag(id: string): Promise<Result<null>> {
    const deleted = await databaseDo(() => {
      return this.db.delete(listTags).where(eq(listTags.id, id)).execute();
    }, "failed to delete from list_tags");
    if (!deleted.ok) {
      return deleted;
    }
    return { ok: true, data: null };
  }

  async saveItem(
    data: Partial<typeof listItems.$inferInsert>,
  ): Promise<Result<ListItem>> {
    const result = await databaseDo(() => {
      return this.db
        .insert(listItems)
        .values(data as typeof listItems.$inferInsert)
        .onConflictDoUpdate({
          target: listItems.id,
          set: data,
        })
        .returning()
        .execute();
    }, "failed to insert into list_items");
    if (!result.ok) {
      return result;
    }
    if (result.data.length !== 1) {
      return { ok: false, error: IncorrectReturnsLength };
    }
    return { ok: true, data: result.data[0] };
  }

  async deleteItem(id: string): Promise<Result<null>> {
    const result = await databaseDo(() => {
      return this.db.delete(listItems).where(eq(listItems.id, id)).execute();
    }, "failed to delete from list_items");
    if (!result.ok) {
      return result;
    }
    return { ok: true, data: null };
  }
}
