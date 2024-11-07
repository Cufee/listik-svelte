import type { List, User } from "$lib/server/db/schema";
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
