import { error, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = ({ url, request }) => {
  //
  redirect(307, "/app");
};
