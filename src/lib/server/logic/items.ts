import { type Result } from "$lib/result";
import type { Database } from "../db";
import type { listItems } from "../db/schema";
import type { ListItem } from "../db/types";

type SaveItemResult = {
  errors: Record<string, string>;
  success: false;
} | {
  item: ListItem;
  success: true;
};

export async function upsertListItem(
  db: Database,
  userId: string,
  listId: string,
  form: Record<string, string>,
): Promise<Result<SaveItemResult>> {
  const errors: Record<string, string> = {};
  if (!form.id && !form.name) {
    errors.name = "item name cannot be blank";
  }
  if (form.name && form.name.length < 3) {
    errors.name = "item name should be at least 3 characters";
  }
  if (form.name && form.name.length > 32) {
    errors.name = "item name should be at most 32 characters";
  }
  if (form.description?.length > 80) {
    errors.description = "description cannot be longer than 80 characters";
  }
  if (form.price?.length > 8) {
    errors.price = "price cannot be longer than 8 characters";
  }
  let quantity = parseInt(form.quantity) || -1;
  if (quantity > Number.MAX_SAFE_INTEGER) {
    quantity = 1;
  }
  if (Object.keys(errors).length > 0) {
    return { ok: true, data: { errors, success: false } };
  }

  const data: Partial<typeof listItems.$inferInsert> = {
    listId,
    id: form.id,
    name: form.name,
    price: form.price,
    quantity: quantity,
    description: form.description,
    checkedAt: form.checked === "true" ? new Date() : null,
  };
  if (!data.id) {
    data.createdBy = userId;
  }

  const item = await db.lists.saveItem(data);
  if (!item.ok) {
    return item;
  }
  return { ok: true, data: { success: true, item: item.data } };
}
