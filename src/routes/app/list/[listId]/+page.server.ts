import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, params }) => {
  const member = await locals.db.lists.member(
    locals.session.user.id,
    params.listId,
  );
  if (!member.ok) {
    return redirect(307, "/app");
  }

  const listWithItems = await locals.db.lists.get(member.data.listId, true);
  if (!listWithItems.ok) {
    return redirect(307, "/app");
  }

  return { list: listWithItems.data };
};