import { defineConfig } from "drizzle-kit";
if (!process.env.DB_FILE_NAME) throw new Error("DB_FILE_NAME is not set");

export default defineConfig({
	schema: "./src/lib/server/db/schema.ts",

	dbCredentials: {
		url: process.env.DB_FILE_NAME!,
	},

	verbose: true,
	strict: true,
	dialect: "sqlite",
});
