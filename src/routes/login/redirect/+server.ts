import { logger } from "$lib/logger";
import { getOrCreateUser, verifyToken } from "$lib/server/logic/google";
import { error, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ cookies, request }) => {
  const cookieToken = cookies.get("g_csrf_token");
  if (!cookieToken) {
    logger.debug("missing g_csrf_token cookie");
    error(400, { message: "Failed to log in with Google. Please try again." });
  }
  const form = await request.formData();
  const formToken = form.get("g_csrf_token");
  if (cookieToken !== formToken) {
    logger.debug("missing or invalid g_csrf_token in form");
    error(400, { message: "Failed to log in with Google. Please try again." });
  }

  const credential = form.get("credential");
  if (!credential) {
    logger.debug("missing credential in form");
    error(400, { message: "Failed to log in with Google. Please try again." });
  }

  // Validate token
  const payload = await verifyToken(credential.toString());
  if (!payload.ok) {
    logger.debug(
      "google auth failed to validate credential",
      payload.error,
    );
    error(400, { message: "Failed to log in with Google. Please try again." });
  }

  // Check if email is verified
  if (!!payload.data.email) {
    logger.debug("google auth failed, missing email", {
      userId: payload.data.sub,
    });
    error(400, {
      message:
        "Failed to log in with Google. Your account is not eligible to register for our app.",
    });
  }
  if (payload.data.email_verified !== true) {
    logger.debug("google auth failed, unverified email", {
      userId: payload.data.sub,
    });
    error(400, {
      message:
        "You need to verify your Google account email address before using our app.",
    });
  }

  const user = await getOrCreateUser(payload.data);
  if (!user.ok) {
    logger.debug("google auth failed, failed to create a user", {
      userId: payload.data.sub,
      error: user.error,
    });
    error(400, {
      message:
        "Failed to log in with Google. Your account might not eligible to register for our app at this time.",
    });
  }

  // Create a session cookie

  // Update the user info in the background

  redirect(307, "/app");
};
