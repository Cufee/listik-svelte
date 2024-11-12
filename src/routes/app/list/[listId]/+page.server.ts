import type { ListItem } from "$lib/server/db/types";
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
    action: "save-item";
    success: true;
    item: ListItem;
  }
  | {
    action: "delete-item";
    success: true;
    item: string;
  };

export const actions = {
  "save-item": async ({ request, locals, params }): Promise<FormResponse> => {
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
    const result = await upsertListItem(
      locals.db,
      locals.session.user.id,
      params.listId,
      form,
    );
    if (!result.ok) {
      return fail(500, {
        errors: {},
        values: form,
        success: false,
      });
    }
    if (!result.data.success) {
      return fail(400, {
        values: form,
        ...result.data,
      });
    }

    return { ...result.data, action: "save-item" };
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
