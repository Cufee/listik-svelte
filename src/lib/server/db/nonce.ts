import type { Result } from "$lib/result";
import cuid from "cuid";
import moment from "moment";
import { databaseDo, db } from ".";
import { type Nonce, nonces } from "./schema";

export async function newNonce(): Promise<Result<Nonce>> {
  const hash = new Bun.CryptoHasher("sha256");
  hash.update(cuid());

  const data: typeof nonces.$inferInsert = {
    value: hash.digest().toString("hex"),
    expiresAt: moment().add(5, "minutes").toDate(),
  };

  const inserted = await databaseDo(() => {
    return db.insert(nonces).values(data).returning().execute();
  }, "failed to insert a nonce");
  if (!inserted.ok) {
    return inserted;
  }

  if (inserted.data.length !== 1) {
    return {
      ok: false,
      message: "wrong number of records returned",
      error: null,
    };
  }
  return { ok: true, data: inserted.data[0] };
}
