import { json, redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals, params }) => {
	if (!locals.authenticated) {
		return redirect(303, '/login');
	}
	if (!params.listId) {
		return redirect(303, '/app');
	}
	const member = await locals.db.lists.member(locals.session.user.id, params.listId);
	if (!member.ok) {
		return redirect(303, '/app');
	}

	const listWithItems = await locals.db.lists.get(member.data.listId, {
		items: true
	});
	if (!listWithItems.ok) {
		return json(listWithItems);
	}

	return json({ ok: true, data: listWithItems.data.items });
};
