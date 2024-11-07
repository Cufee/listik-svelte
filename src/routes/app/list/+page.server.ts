import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
	// Check if a user has only 1 list, if they do - redirect there

	redirect(300, "/app"); // 300 Multiple Choices
};
