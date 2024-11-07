import { getUserLists } from "$lib/server/db/lists";
import type { List } from "$lib/server/db/schema";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (
  { locals },
): Promise<{ lists: List[] }> => {
  const lists = await getUserLists(locals.session.user.id);
  if (!lists.ok || lists.data.length === 0) {
    return redirect(307, "/app/onboarding");
  }
  return {
    lists: lists.data,
  };
};
