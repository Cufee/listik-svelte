import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, url }) => {
  if (locals.authenticated === true) {
    return redirect(307, url.searchParams.get("from") || "/app");
  }
  return { state: url.searchParams.get("from") };
};
