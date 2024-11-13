import { PUBLIC_ORIGIN } from "$env/static/public";
import { parseForm } from "$lib/server/logic/forms";
import {
  type ActionFailure,
  type Actions,
  error,
  fail,
  redirect,
} from "@sveltejs/kit";

type FormResponse =
  | ActionFailure<
    {
      invalid: true;
      errors: Record<string, string>;
      values: Record<string, string>;
    }
  >
  | {};

export const actions = {
  "redeem-invite": async ({ request, locals }): Promise<FormResponse> => {
    if (!locals.authenticated) {
      return redirect(303, "/login");
    }

    const form = parseForm(await request.formData());
    if (!form.code) {
      return fail(400, {
        invalid: true,
        errors: { code: "Invite code cannot be left blank" },
      });
    }

    const listsCount = await locals.db.lists.visibleToUserCount(
      locals.session.user.id,
    );

    let code = form?.code?.replaceAll(`${PUBLIC_ORIGIN}/join/`, "") ?? "";
    if (code.length < 8 || code.length > 32) {
      return fail(400, {
        values: form,
        invalid: true,
        errors: { code: "Invalid or expired invite code" },
      });
    }
    const member = await locals.db.invites.redeem(
      locals.session.user.id,
      code,
    );
    if (!member.ok) {
      return fail(400, {
        values: form,
        invalid: true,
        errors: { code: "Invalid or expired invite code" },
      });
    }

    if (!listsCount.ok || listsCount.data === 0) {
      return redirect(
        303,
        "/app/onboarding/how-to?continue=" + member.data.listId,
      );
    }
    return redirect(303, "/app/list/" + member.data.listId);
  },

  "new-list": async ({ request, locals }): Promise<FormResponse> => {
    if (!locals.authenticated) {
      return redirect(303, "/login");
    }

    const form = parseForm(await request.formData());
    const errors: Record<string, string> = {};
    if (!form.name) {
      errors.name = "Name cannot be left blank";
    }
    if (form.name && (form.name.length < 3 || form.name.length > 14)) {
      errors.name = "Name should be between 3 and 14 characters";
    }
    if (form.description && form.description.length > 80) {
      errors.description = "Description cannot be longer than 80 characters";
    }
    if (Object.keys(errors).length > 0) {
      return fail(400, {
        errors,
        values: form,
        invalid: true,
      });
    }

    const listsCount = await locals.db.lists.visibleToUserCount(
      locals.session.user.id,
    );
    const list = await locals.db.lists.create({
      name: form.name,
      icon: form.icon,
      color: form.color,
      description: form.description,
      ownerId: locals.session.user.id,
    });
    if (!list.ok) {
      return error(500, "Failed to create a list");
    }
    if (!listsCount.ok || listsCount.data === 0) {
      return redirect(303, "/app/onboarding/how-to?continue=" + list.data.id);
    }

    return redirect(303, "/app/list/" + list.data.id);
  },
} satisfies Actions;
