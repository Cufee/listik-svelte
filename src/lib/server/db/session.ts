import { logger } from "$lib/logger";
import type { Result } from "$lib/result";
import moment from "moment";
import { databaseDo, db } from ".";
import { type Session, sessions, type User } from "./schema";

const sessionDurationDays = 90;

export interface SessionWithUser extends Session {
  user: User | null;
}

export async function getSessionWithUser(
  cookieValue: string,
  refresh: boolean,
): Promise<Result<SessionWithUser>> {
  logger.debug("retrieving session with user", { cookie: cookieValue });

  const session = await databaseDo(() => {
    return db.query.sessions.findFirst({
      with: { user: true },
      where: (table, { and, eq, gt }) =>
        and(
          eq(table.cookieValue, cookieValue),
          gt(table.expiresAt, new Date()),
        ),
    }).execute();
  }, "failed to get a session record");
  if (!session.ok) {
    return session;
  }
  if (!session.data) {
    logger.debug("session not found", { cookie: cookieValue });
    return { ok: false, message: "session not found", error: null };
  }
  if (!session.data.user || !session.data.user.id) {
    logger.debug("session has no user", {
      cookie: cookieValue,
      id: session.data.id,
    });
    return { ok: true, data: { ...session.data, user: null } };
  }

  { // update the session, this operation should not affect the return value
    const sessionUpdate: Partial<Session> = {
      lastUsedAt: new Date(),
    };

    if (refresh && shouldRefreshSession(session.data.expiresAt)) { // update the session expiration
      const expiration = moment()
        .add(sessionDurationDays, "days")
        .toDate();
      sessionUpdate.expiresAt = expiration;

      logger.debug("updating session expiration", {
        cookie: cookieValue,
        id: session.data.id,
        current: session.data.expiresAt,
        new: expiration,
      });
    }
    databaseDo(() => {
      return db.update(sessions).set(sessionUpdate).execute(); // async in the background
    }, "failed to update a session record");
  }

  logger.debug("found a valid session", {
    cookie: cookieValue,
    id: session.data.id,
    user: session.data.user.id,
  });

  return { ok: true, data: { ...session.data, user: session.data.user } };
}

function shouldRefreshSession(expiration: Date): boolean {
  return moment(expiration).diff(moment(), "days") < 30;
}
