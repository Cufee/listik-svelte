import { AppError, type Result } from "$lib/result";
import type { Database } from "../db";
import type { ListItem, listItems } from "../db/schema";

export interface ItemUpsert {
  listId: string;
  id?: string;
  name?: string;
  description?: string;
  price?: string;
  quantity?: number;
  checkedAt?: Date | null;
}

export async function upsertListItem(
  db: Database,
  userId: string,
  payload: ItemUpsert,
): Promise<Result<ListItem>> {
  if (!payload.id && !payload.name) {
    return {
      ok: false,
      error: new AppError("name is required to create a new item", "BAD_INPUT"),
    };
  }

  const data: Partial<typeof listItems.$inferInsert> = { ...payload };
  if (!data.id) {
    data.createdBy = userId;
  }
  return db.lists.saveItem(data);
}
