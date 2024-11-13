import { logger } from "$lib/logger";
import type { ListInvite, User } from "$lib/server/db/types";
import {
  type ActionFailure,
  type Actions,
  fail,
  redirect,
} from "@sveltejs/kit";
import { createHash } from "crypto";
import cuid from "cuid";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, params }) => {
  const member = await locals.db.lists.member(
    locals.session.user.id,
    params.listId,
  );
  if (!member.ok) {
    return redirect(307, "/app");
  }

  const list = await locals.db.lists.get(member.data.listId, {
    members: true,
    tags: true,
  });
  if (!list.ok) {
    return redirect(307, "/app");
  }

  if (list.data.ownerId === locals.session.user.id) {
    const invites = await locals.db.invites.listInvites(list.data.id);
    if (invites.ok) {
      list.data.invites = invites.data;
    } else {
      logger.error(invites.error, "failed to get list invites");
    }
  }

  return { list: list.data, user: locals.session.user as User };
};

type FormResponse =
  | ActionFailure<
    {
      message: string;
      success: false;
    }
  >
  | {
    action: "create-invite";
    success: true;
    invite: ListInvite;
  }
  | {
    action: "disable-invite";
    success: true;
    invite: string;
  };

export const actions = {
  "create-invite": async (
    { request, locals, params },
  ): Promise<FormResponse> => {
    if (!locals.authenticated) {
      return redirect(303, "/login");
    }
    if (!params.listId) {
      return redirect(303, "/app");
    }
    const list = await locals.db.lists.get(params.listId);
    if (!list.ok) {
      return redirect(303, "/app");
    }
    if (list.data.ownerId !== locals.session.user.id) {
      return fail(403, {
        message: "You are not able to create list invites.",
        success: false,
      });
    }

    // Generate an invite code
    const hash = createHash("sha256");
    hash.update(`invite-${list.data.id}-${locals.session.user.id}-${cuid()}`);
    const code = "lk-" + hash.digest("hex").substring(0, 8);

    const invite = await locals.db.invites.create({
      userId: locals.session.user.id,
      listId: list.data.id,
      code,
    });
    if (!invite.ok) {
      return fail(500, {
        message: "Failed to create an invite - " + invite.error.message,
        success: false,
      });
    }

    return { success: true, invite: invite.data, action: "create-invite" };
  },
} satisfies Actions;
