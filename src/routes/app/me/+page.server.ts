import type { List, User } from "$lib/server/db/types";
import { parseForm } from "$lib/server/logic/forms";
import {
  type ActionFailure,
  type Actions,
  fail,
  redirect,
} from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (
  { locals },
): Promise<{ user: User; lists: List[] }> => {
  const user = locals.session.user as User; // TODO: check why the type if not inferred from locals
  const lists = await locals.db.lists.visibleToUser(user.id);
  if (!lists.ok) {
    return {
      user,
      lists: [],
    };
  }
  return {
    user,
    lists: lists.data,
  };
};

type FormResponse =
  | ActionFailure<
    {
      message?: string;
      success: false;
    }
  >
  | {
    action: "leave-list";
    success: true;
    list: string;
  };

export const actions = {
  "leave-list": async ({ request, locals, params }): Promise<FormResponse> => {
    if (!locals.authenticated) {
      return redirect(303, "/login");
    }

    const form = parseForm(await request.formData());
    if (!form.listId) {
      return fail(400, {
        message: "Failed to leave a list",
        success: false,
      });
    }

    const result = await locals.db.lists.deleteMember(
      form.listId,
      locals.session.user.id,
    );
    if (!result.ok) {
      return fail(400, {
        message: "Failed to leave a list - " + result.error.message,
        success: false,
      });
    }

    return { success: true, list: form.listId, action: "leave-list" };
  },
} satisfies Actions;
