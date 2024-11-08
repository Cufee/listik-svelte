import type { User } from "$lib/server/db/schema";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
  return {
    user: locals.session?.user as User ?? null,
  };
};
