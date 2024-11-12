import { Database, newClient } from "$lib/server/db";
import { type Handle, redirect } from "@sveltejs/kit";
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

export const handle = sequence(
  injectLocals(new Database(newClient())),
);
