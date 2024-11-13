import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals }) => {
  return redirect(303, locals.authenticated ? "/app" : "/login");
};
