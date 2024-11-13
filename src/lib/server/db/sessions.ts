import type { Result } from "$lib/result";
import { eq } from "drizzle-orm";
import moment from "moment";
import {
  type Client,
  databaseDo,
  DatabaseError,
  IncorrectReturnsLength,
} from ".";
import { sessions } from "./schema";
import type { Session, User } from "./types";

const sessionDurationDays = 90;

export interface SessionWithUser extends Session {
  user: User | null;
}

export class SessionOperations {
  private db: Client;
  constructor(db: Client) {
    this.db = db;
  }

  async findByCookie(
    cookieValue: string,
    refresh: boolean,
  ): Promise<Result<SessionWithUser>> {
    const session = await databaseDo(() => {
      return this.db.query.sessions.findFirst({
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
      return { ok: false, error: new DatabaseError("session not found") };
    }
    if (!session.data.user || !session.data.user.id) {
      return { ok: true, data: { ...session.data, user: null } };
    }

    { // update the session, this operation should not affect the return value
      const sessionUpdate: Partial<Session> = {
        lastUsedAt: moment().toDate(),
      };

      if (refresh && shouldRefreshSession(session.data.expiresAt)) { // update the session expiration
        const expiration = moment()
          .add(sessionDurationDays, "days")
          .toDate();
        sessionUpdate.expiresAt = expiration;
      }

      const sessionId = session.data.id;
      databaseDo(() => {
        return this.db.update(sessions)
          .set(sessionUpdate)
          .where(eq(sessions.id, sessionId))
          .execute(); // async in the background
      }, "failed to update a session record");
    }
    return { ok: true, data: { ...session.data, user: session.data.user } };
  }

  async create(
    userId: string,
    identifier: string,
    cookie: string,
  ): Promise<Result<Session>> {
    const data: typeof sessions.$inferInsert = {
      userId,
      identifier,
      cookieValue: cookie,
      lastUsedAt: new Date(),
      expiresAt: moment().add(sessionDurationDays, "days").toDate(),
    };
    const result = await databaseDo(() => {
      return this.db.insert(sessions).values(data).returning().execute();
    }, "failed to insert into sessions");
    if (!result.ok) {
      return result;
    }
    if (result.data.length !== 1) {
      return { ok: false, error: IncorrectReturnsLength };
    }
    return { ok: true, data: result.data[0] };
  }

  async expire(id: string): Promise<Result<null>> {
    const result = await databaseDo(() => {
      return this.db.update(sessions).set({ expiresAt: new Date(0) }).where(
        eq(sessions.id, id),
      ).execute();
    }, "failed to update sessions");
    if (!result.ok) {
      return result;
    }
    return { ok: true, data: null };
  }
}

function shouldRefreshSession(expiration: Date): boolean {
  return moment(expiration).diff(moment(), "days") < 30;
}
