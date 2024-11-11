import type { ListItem } from "$lib/server/db/schema";
import { parseForm } from "$lib/server/logic/forms";
import { upsertListItem } from "$lib/server/logic/items";
import {
  type ActionFailure,
  type Actions,
  fail,
  redirect,
} from "@sveltejs/kit";
import moment from "moment";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, params }) => {
  const member = await locals.db.lists.member(
    locals.session.user.id,
    params.listId,
  );
  if (!member.ok) {
    return redirect(303, "/app");
  }

  const listWithItems = await locals.db.lists.get(member.data.listId, {
    items: true,
  });
  if (!listWithItems.ok) {
    return redirect(303, "/app");
  }

  listWithItems.data.items = listWithItems.data.items.filter((i) =>
    // Only return items that are not checked or were checked recently
    !i.checkedAt || moment().diff(moment(i.checkedAt), "hours") < 6
  );

  return { list: listWithItems.data };
};

type FormResponse =
  | ActionFailure<
    {
      alert?: string;
      success: false;
      errors: Record<string, string>;
      values: Record<string, string>;
    }
  >
  | {
    action: "new-item";
    success: true;
    item: ListItem;
  }
  | {
    action: "delete-item";
    success: true;
    item: string;
  };

export const actions = {
  "new-item": async ({ request, locals, params }): Promise<FormResponse> => {
    if (!locals.authenticated) {
      return redirect(303, "/login");
    }
    if (!params.listId) {
      return redirect(303, "/app");
    }
    const member = await locals.db.lists.member(
      locals.session.user.id,
      params.listId,
    );
    if (!member.ok) {
      return redirect(303, "/app");
    }

    const form = parseForm(await request.formData());
    const errors: Record<string, string> = {};
    if (!form.name) {
      errors.name = "item name cannot be blank";
    }
    if (form.name && (form.name.length < 3 || form.name.length > 32)) {
      errors.name = "item name should be between 3 and 32 characters";
    }
    if (form.description?.length > 80) {
      errors.description = "Description cannot be longer than 80 characters";
    }
    if (form.price?.length > 8) {
      errors.price = "Price cannot be longer than 8 characters";
    }
    const quantity = parseInt(form.quantity) || 1;
    if (quantity < 1 || quantity > 99) {
      errors.quantity = "Quantity should be between 1 and 99";
    }
    if (Object.keys(errors).length > 0) {
      return fail(400, {
        errors,
        values: form,
        success: false,
      });
    }

    const item = await upsertListItem(locals.db, locals.session.user.id, {
      listId: params.listId,
      name: form.name,
      description: form.description,
      quantity: quantity || 1,
      price: form.price,
    });

    if (!item.ok) {
      return fail(500, {
        errors,
        values: form,
        success: false,
      });
    }

    return { success: true, item: item.data, action: "new-item" };
  },
  "delete-item": async ({ request, locals, params }): Promise<FormResponse> => {
    if (!locals.authenticated) {
      return redirect(303, "/login");
    }
    if (!params.listId) {
      return redirect(303, "/app");
    }
    const member = await locals.db.lists.member(
      locals.session.user.id,
      params.listId,
    );
    if (!member.ok) {
      return redirect(303, "/app");
    }

    const form = parseForm(await request.formData());
    if (!form.id) {
      return fail(400, {
        alert: "Failed to delete an item - invalid item selected",
        errors: { id: "item id is required" },
        values: form,
        success: false,
      });
    }

    const item = await locals.db.lists.deleteItem(form.id);
    if (!item.ok) {
      return fail(500, {
        alert: "Failed to delete an item - " + item.error.message,
        errors: {},
        values: form,
        success: false,
      });
    }

    return { success: true, item: form.id, action: "delete-item" };
  },
} satisfies Actions;
