import { db } from "$lib/server/db";
import { getSessionWithUser } from "$lib/server/db/session";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.db = db;
  event.locals.session = null;
  event.locals.authenticated = false;

  const sessionCookie = event.cookies.get("lk-session");
  if (!!sessionCookie) {
    const session = await getSessionWithUser(sessionCookie, true);
    if (session.ok) {
      event.locals.session = session.data;
      event.locals.authenticated = !!session.data.user?.id;
    }
  }
  return resolve(event);
};
