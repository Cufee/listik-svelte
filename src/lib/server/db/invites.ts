import type { Result } from "$lib/result";
import { and, eq, sql } from "drizzle-orm";
import { type Client, databaseDo, IncorrectReturnsLength } from ".";
import { listInvites, listMembers } from "./schema";
import type { ListInvite, ListMember } from "./types";

export class InviteOperations {
  private db: Client;
  constructor(db: Client) {
    this.db = db;
  }

  async create(
    { userId, listId, code }: { userId: string; listId: string; code: string },
  ): Promise<Result<ListInvite>> {
    const result = await databaseDo(() => {
      return this.db
        .insert(listInvites)
        .values({
          createdBy: userId,
          listId,
          code,
        })
        .returning()
        .execute();
    }, "failed to insert into list_invites");
    if (!result.ok) {
      return result;
    }
    if (result.data.length !== 1) {
      return { ok: false, error: IncorrectReturnsLength };
    }
    return { ok: true, data: result.data[0] };
  }

  async redeem(userId: string, code: string): Promise<Result<ListMember>> {
    return await databaseDo(async () => {
      return await this.db.transaction(async (tx) => {
        const invite = await tx
          .update(listInvites)
          .set({
            useCount: sql`${listInvites.useCount} + 1`,
          })
          .where(
            and(
              eq(listInvites.code, code),
              eq(listInvites.enabled, true),
              sql`${listInvites.useCount.name} < ${listInvites.useLimit.name}`,
            ),
          )
          .returning()
          .execute();
        if (invite.length !== 1) {
          throw new Error("invalid return length from list_invites update");
        }

        const member = await tx
          .insert(listMembers)
          .values({
            listId: invite[0].listId,
            userId,
          })
          .returning()
          .execute();
        if (member.length !== 1) {
          throw new Error("invalid return length from list_members insert");
        }
        return member[0];
      });
    }, "transaction failed");
  }
}
