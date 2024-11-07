// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Database } from "$lib/server/db";
import type { SessionWithUser } from "$lib/server/db/session";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			db: Database;
			session: SessionWithUser | null;
			authenticated: bool;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
