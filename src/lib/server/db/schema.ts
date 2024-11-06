import cuid from "cuid";
import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
	id: text("id").primaryKey().$defaultFn(() => cuid()),
	createAt: integer("create_at", { mode: "timestamp" }).default(
		sql`(CURRENT_TIMESTAMP)`,
	),
	updatedAt: integer("updated_at", { mode: "timestamp" }).default(
		sql`(CURRENT_TIMESTAMP)`,
	).$onUpdateFn(() => sql`(CURRENT_TIMESTAMP)`),

	email: text("email").notNull(),
	externalId: text("external_id").notNull().unique(),

	displayName: text("display_name").notNull(),
	profilePicture: text("profile_picture"),
});

export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	lists: many(listMember),
	ownedLists: many(list),
	createdTags: many(listTag),
	createdItems: many(listItem),
	createdInvites: many(listInvite),
}));

export const session = sqliteTable("session", {
	id: text("id").primaryKey().$defaultFn(() => cuid()),
	userId: integer("user_id").references(() => user.id).notNull(),

	createAt: integer("create_at", { mode: "timestamp" }).default(
		sql`(CURRENT_TIMESTAMP)`,
	),
	updatedAt: integer("updated_at", { mode: "timestamp" }).default(
		sql`(CURRENT_TIMESTAMP)`,
	).$onUpdateFn(() => sql`(CURRENT_TIMESTAMP)`),

	expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
	lastUsedAt: integer("last_used_at", { mode: "timestamp" }).notNull(),

	identifier: text("identifier").notNull(),
	cookieValue: text("cookie_value").notNull(),

	label: text("label"),
});

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
}));

export const list = sqliteTable("list", {
	id: text("id").primaryKey().$defaultFn(() => cuid()),
	createAt: integer("create_at", { mode: "timestamp" }).default(
		sql`(CURRENT_TIMESTAMP)`,
	),
	updatedAt: integer("updated_at", { mode: "timestamp" }).default(
		sql`(CURRENT_TIMESTAMP)`,
	).$onUpdateFn(() => sql`(CURRENT_TIMESTAMP)`),

	ownerId: text("owner_id").references(() => user.id),

	name: text("name").notNull(),
	description: text("description"),
});

export const listRelations = relations(list, ({ one, many }) => ({
	owner: one(user, {
		fields: [list.ownerId],
		references: [user.id],
	}),
	members: many(listMember),
}));

export const listMember = sqliteTable("list_member", {
	id: text("id").primaryKey().$defaultFn(() => cuid()),
	createAt: integer("create_at", { mode: "timestamp" }).default(
		sql`(CURRENT_TIMESTAMP)`,
	),
	updatedAt: integer("updated_at", { mode: "timestamp" }).default(
		sql`(CURRENT_TIMESTAMP)`,
	).$onUpdateFn(() => sql`(CURRENT_TIMESTAMP)`),

	userId: text("user_id").references(() => user.id).notNull(),
	listId: text("list_id").references(() => list.id).notNull(),

	permissions: text("permissions"),
});

export const listMemberRelations = relations(listMember, ({ one }) => ({
	list: one(list, {
		fields: [listMember.listId],
		references: [list.id],
	}),
	user: one(user, {
		fields: [listMember.userId],
		references: [user.id],
	}),
}));

export const listTag = sqliteTable("list_tag", {
	id: text("id").primaryKey().$defaultFn(() => cuid()),
	createAt: integer("create_at", { mode: "timestamp" }).default(
		sql`(CURRENT_TIMESTAMP)`,
	),
	updatedAt: integer("updated_at", { mode: "timestamp" }).default(
		sql`(CURRENT_TIMESTAMP)`,
	).$onUpdateFn(() => sql`(CURRENT_TIMESTAMP)`),

	listId: text("list_id").references(() => list.id).notNull(),
	createdBy: text("created_by").references(() => user.id).notNull(),

	name: text("name").notNull(),
	description: text("description"),
	color: text("color"),
	icon: text("icon"),
});

export const listTagRelations = relations(listTag, ({ one }) => ({
	list: one(list, {
		fields: [listTag.listId],
		references: [list.id],
	}),
	user: one(user, {
		fields: [listTag.createdBy],
		references: [user.id],
	}),
}));

export const listInvite = sqliteTable("list_invite", {
	id: text("id").primaryKey().$defaultFn(() => cuid()),
	createAt: integer("create_at", { mode: "timestamp" }).default(
		sql`(CURRENT_TIMESTAMP)`,
	),
	updatedAt: integer("updated_at", { mode: "timestamp" }).default(
		sql`(CURRENT_TIMESTAMP)`,
	).$onUpdateFn(() => sql`(CURRENT_TIMESTAMP)`),

	createdBy: text("created_by").references(() => user.id).notNull(),
	listId: text("list_id").references(() => list.id).notNull(),

	permissions: text("permissions"),

	enabled: integer("enabled", { mode: "boolean" }).default(true),
	code: text("code").notNull().unique(),

	useLimit: integer("use_limit").default(1),
	useCount: integer("use_count").default(0),
});

export const listInviteRelations = relations(listInvite, ({ one }) => ({
	list: one(list, {
		fields: [listInvite.listId],
		references: [list.id],
	}),
	user: one(user, {
		fields: [listInvite.createdBy],
		references: [user.id],
	}),
}));

export const listItem = sqliteTable("list_item", {
	id: text("id").primaryKey().$defaultFn(() => cuid()),
	createAt: integer("create_at", { mode: "timestamp" }).default(
		sql`(CURRENT_TIMESTAMP)`,
	),
	updatedAt: integer("updated_at", { mode: "timestamp" }).default(
		sql`(CURRENT_TIMESTAMP)`,
	).$onUpdateFn(() => sql`(CURRENT_TIMESTAMP)`),

	createdBy: text("created_by").references(() => user.id).notNull(),
	listId: text("list_id").references(() => list.id).notNull(),

	name: text("name").notNull(),
	description: text("description"),
	quantity: integer("quantity"),
	price: text("price"),

	checkedAt: integer("checked_at", { mode: "timestamp" }),
});

export const listItemRelations = relations(listItem, ({ one }) => ({
	list: one(list, {
		fields: [listItem.listId],
		references: [list.id],
	}),
	user: one(user, {
		fields: [listItem.createdBy],
		references: [user.id],
	}),
}));
