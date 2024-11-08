import { env } from "$env/dynamic/private";
import { Database, newClient } from "$lib/server/db";
import { error, type Handle, redirect } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

const injectLocals = (db: Database): Handle => async ({ event, resolve }) => {
  event.locals.db = db;
  event.locals.session = null;
  event.locals.authenticated = false;

  const sessionCookie = event.cookies.get("lk-session");
  if (!!sessionCookie) {
    const session = await db.sessions.findByCookie(sessionCookie, true);
    if (session.ok) {
      event.locals.session = session.data;
      event.locals.authenticated = !!session.data.user?.id;
    }
  }

  if (event.url.pathname.startsWith("/app") && !event.locals.authenticated) {
    return redirect(303, "/login");
  }

  const response = await resolve(event);
  return response;
};

const csrf =
  (allowed_paths: string[]): Handle => async ({ event, resolve }) => {
    const forbidden = ["POST", "PUT", "PATCH", "DELETE"].includes(
      event.request.method,
    ) &&
      event.request.headers.get("origin") !== event.url.origin &&
      is_form_content_type(event.request) &&
      !allowed_paths.includes(event.url.pathname);

    if (forbidden && env.NODE_ENV !== "development") {
      return error(
        403,
        `Cross-site ${event.request.method} form submissions are forbidden`,
      );
    }

    return resolve(event);
  };

const is_content_type = (request: Request, ...types: string[]) => {
  const type = request.headers.get("content-type")?.split(";", 1)[0].trim() ??
    "";
  return types.includes(type);
};

const is_form_content_type = (request: Request) => {
  return is_content_type(
    request,
    "application/x-www-form-urlencoded",
    "multipart/form-data",
  );
};

export const handle = sequence(
  csrf(["/login/redirect"]),
  injectLocals(new Database(newClient())),
);
