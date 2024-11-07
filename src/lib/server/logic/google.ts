import { env as prv } from "$env/dynamic/private";
import { env as pub } from "$env/dynamic/public";
import { AppError, InputValidationError, type Result } from "$lib/result";
import { OAuth2Client, type TokenPayload } from "google-auth-library";
import type { User } from "../db/schema";
import { createUser, findUserByExternalId } from "../db/users";
const oauthClient = new OAuth2Client({
  clientId: pub.PUBLIC_GOOGLE_CLIENT_ID,
  clientSecret: prv.GOOGLE_CLIENT_SECRET,
});

export class GoogleAuthError extends AppError {
  constructor(message: string, cause?: unknown) {
    super(message, "GOOGLE_AUTH_ERROR", cause);
  }
}

export async function verifyToken(
  token: string,
): Promise<Result<TokenPayload>> {
  const ticket = await oauthClient.verifyIdToken({
    idToken: token,
    audience: pub.PUBLIC_GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload) {
    return { ok: false, error: new GoogleAuthError("missing payload") };
  }
  return { ok: true, data: payload };
}

export async function getOrCreateUser(
  payload: TokenPayload,
): Promise<Result<User>> {
  { // existing user record
    const user = await findUserByExternalId(payload.sub);
    if (user.ok) {
      return user;
    }
  }

  if (!payload.email) {
    return { ok: false, error: new InputValidationError("email is required") };
  }
  if (payload.email_verified !== true) {
    return {
      ok: false,
      error: new InputValidationError("email is not verified"),
    };
  }
  return await createUser({
    email: payload.email,
    externalId: payload.sub,
    displayName: payload.name || payload.email,
    profilePicture: payload.picture,
  });
}
