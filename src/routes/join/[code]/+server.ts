import { error, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals, url, params }) => {
  if (!locals.authenticated) {
    return redirect(303, "/login?from=" + url.pathname);
  }

  const member = await locals.db.invites.redeem(
    locals.session.user.id,
    params.code,
  );
  if (!member.ok) {
    return error(400, "Invalid or expired invite code");
  }

  return redirect(303, "/app/list/" + member.data.listId);
};
