import type { Result } from "$lib/result";
import { and, count, eq } from "drizzle-orm";
import {
  type Client,
  databaseDo,
  DatabaseError,
  IncorrectReturnsLength,
} from ".";
import { listItems, listMembers, lists, listTags } from "./schema";
import type { List, ListInvite, ListItem, ListMember, ListTag } from "./types";

export interface ItemsCategory {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

export type ExtendedList = List & {
  tags: ListTag[];
  items: ListItem[];
  invites: ListInvite[];
  members: { id: string; name: string; picture: string | null; joined: Date }[];
};

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
    include: { items?: true; tags?: true; members?: true; invites?: true } = {},
  ): Promise<
    Result<ExtendedList>
  > {
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

    const extendedList: ExtendedList = { ...list.data, members: [] };
    extendedList.invites = list.data.invites ?? [];
    extendedList.items = list.data.items ?? [];
    extendedList.tags = list.data.tags ?? [];

    if (include.members) {
      const memberIds = list.data.members.map((m) => m.userId);
      const users = await databaseDo(() => {
        return this.db.query.users.findMany({
          where: (table, { inArray }) => inArray(table.id, memberIds),
        }).execute();
      }, "failed to get from users");
      if (!users.ok) {
        return users;
      }
      if (!users.data) {
        return { ok: false, error: new DatabaseError("users not found") };
      }
      extendedList.members = users.data.map((u) => ({
        picture: u.profilePicture,
        joined: u.createdAt,
        name: u.displayName,
        id: u.id,
      }));
    }

    return { ok: true, data: extendedList };
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
    // Remove all unset keys to appease the drizzle gods
    Object.keys(data).forEach((key) => {
      if ((data as any)[key] === undefined) {
        delete (data as any)[key];
      }
    });

    const result = await databaseDo(() => {
      if (!data.id) {
        return this.db
          .insert(listItems)
          .values(data as typeof listItems.$inferInsert)
          .returning()
          .execute();
      }
      return this.db
        .update(listItems)
        .set(data as typeof listItems.$inferInsert)
        .where(eq(listItems.id, data.id!))
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

  async deleteMember(listId: string, userId: string): Promise<Result<null>> {
    const result = await databaseDo(() => {
      return this.db.delete(listMembers).where(
        and(eq(listMembers.listId, listId), eq(listMembers.userId, userId)),
      ).execute();
    }, "failed to delete from list_members");
    if (!result.ok) {
      return result;
    }
    return { ok: true, data: null };
  }

  async createCategory(
    userId: string,
    listId: string,
    data: ItemsCategory,
  ): Promise<Result<ListTag>> {
    const category = await databaseDo(() => {
      return this.db
        .insert(listTags)
        .values({
          ...data,
          listId,
          createdBy: userId,
        })
        .returning()
        .execute();
    }, "failed to insert into list_tags");
    if (!category.ok) {
      return category;
    }
    if (category.data.length !== 1) {
      return { ok: false, error: IncorrectReturnsLength };
    }
    return { ok: true, data: category.data[0] };
  }

  async updateCategory(
    id: string,
    data: Partial<ItemsCategory>,
  ): Promise<Result<ListTag>> {
    // Remove all unset keys to appease the drizzle gods
    Object.keys(data).forEach((key) => {
      if ((data as any)[key] === undefined) {
        delete (data as any)[key];
      }
    });

    const category = await databaseDo(() => {
      return this.db
        .update(listTags)
        .set(data)
        .where(eq(listTags.id, id))
        .returning()
        .execute();
    }, "failed to update in list_tags");
    if (!category.ok) {
      return category;
    }
    if (category.data.length !== 1) {
      return { ok: false, error: IncorrectReturnsLength };
    }
    return { ok: true, data: category.data[0] };
  }

  async deleteCategory(
    id: string,
  ): Promise<Result<null>> {
    const result = await databaseDo(() => {
      return this.db
        .delete(listTags)
        .where(eq(listTags.id, id))
        .execute();
    }, "failed to update in list_tags");
    if (!result.ok) {
      return result;
    }
    return { ok: true, data: null };
  }
}
