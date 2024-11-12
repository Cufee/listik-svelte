// import { upsertListItem } from "$lib/server/logic/items";
// import { error, redirect } from "@sveltejs/kit";
// import type { RequestHandler } from "./$types";

// export const POST: RequestHandler = async ({ locals, request }) => {
//   if (!locals.authenticated) {
//     return error(403);
//   }

//   const { listId }: { listId: string } = await request.json();
//   if (!listId) {
//     return error(400, "missing listId");
//   }
//   const member = await locals.db.lists.member(
//     locals.session.user.id,
//     listId,
//   );
//   if (!member.ok) {
//     return redirect(403, "/app");
//   }

//   const form = parseForm(await request.formData());
//   const result = await upsertListItem(
//     locals.db,
//     locals.session.user.id,
//     listId,
//     form,
//   );
//   if (!result.ok) {
//     return error(500, result.error.message);
//   }
//   if (!result.data.success) {
//     return error(400, result.data.errors);
//   }

//   return { ...result.data, action: "save-item" };

//   return new Response();
// };
