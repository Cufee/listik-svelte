import type { ListItem } from "$lib/server/db/schema";
import { type ActionFailure, type Actions, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, params }) => {
  const member = await locals.db.lists.member(
    locals.session.user.id,
    params.listId,
  );
  if (!member.ok) {
    return redirect(303, "/app");
  }

  const listWithItems = await locals.db.lists.get(member.data.listId, true);
  if (!listWithItems.ok) {
    return redirect(303, "/app");
  }

  return { list: listWithItems.data };
};

type FormResponse =
  | ActionFailure<
    {
      success: false;
      errors: Record<string, string>;
      values: Record<string, string>;
    }
  >
  | {
    success: true;
    item: ListItem;
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

    // const form = parseForm(await request.formData());
    // const errors: Record<string, string> = {};
    // if (!form.name) {
    //   errors.name = "Name cannot be left blank";
    // }
    // if (form.name && (form.name.length < 3 || form.name.length > 14)) {
    //   errors.name = "Name should be between 3 and 14 characters";
    // }
    // if (form.description && form.description.length > 80) {
    //   errors.description = "Description cannot be longer than 80 characters";
    // }
    // if (Object.keys(errors).length > 0) {
    //   console.log(form);
    //   return fail(400, {
    //     errors,
    //     values: form,
    //     invalid: true,
    //   });
    // }

    // const list = await locals.db.lists.create({
    //   name: form.name,
    //   icon: form.icon,
    //   color: form.color,
    //   description: form.description,
    //   ownerId: locals.session.user.id,
    // });
    // if (!list.ok) {
    //   return error(500, "Failed to create a list");
    // }

    return { success: true, item: { id: "asd" } as ListItem };
  },
} satisfies Actions;
