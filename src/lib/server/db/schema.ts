import cuid from "cuid";
import { type InferSelectModel, relations, sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("user", {
	id: text("id").primaryKey().$defaultFn(() => cuid()),
	createAt: integer("create_at", { mode: "timestamp" }).default(
		sql`(CURRENT_TIMESTAMP)`,
	),
	updatedAt: integer("updated_at", { mode: "timestamp" }).default(
		sql`(CURRENT_TIMESTAMP)`,
	).$onUpdateFn(() => new Date()),

	email: text("email").notNull(),
	externalId: text("external_id").notNull().unique(),

	displayName: text("display_name").notNull(),
	profilePicture: text("profile_picture"),
}, (table) => ({
	emailIdx: index("user_email_idx").on(table.email),
	externalIdIdx: index("user_external_id_idx").on(table.externalId),
}));

export interface User extends InferSelectModel<typeof users> {}

export const userRelations = relations(users, ({ many }) => ({
	sessions: many(sessions),
	lists: many(listMembers),
	ownedLists: many(lists),
	createdTags: many(listTags),
	createdItems: many(listItems),
	createdInvites: many(listInvites),
}));

export const sessions = sqliteTable("session", {
	id: text("id").primaryKey().$defaultFn(() => cuid()),
	createAt: integer("create_at", { mode: "timestamp" }).default(
		sql`(CURRENT_TIMESTAMP)`,
	),
	updatedAt: integer("updated_at", { mode: "timestamp" }).default(
		sql`(CURRENT_TIMESTAMP)`,
	).$onUpdateFn(() => new Date()),

	userId: text("user_id").references(() => users.id).notNull(),
	expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
	lastUsedAt: integer("last_used_at", { mode: "timestamp" }).notNull(),

	identifier: text("identifier").notNull(),
	cookieValue: text("cookie_value").notNull(),

	label: text("label"),
}, (table) => ({
	cookieValueExpiresIdx: index("session_cookie_value_expires_idx").on(
		table.cookieValue,
		table.expiresAt,
	),
	userIdIdx: index("session_user_id_idx").on(table.userId),
}));

export interface Session extends InferSelectModel<typeof sessions> {}

export const sessionRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id],
	}),
}));

export const lists = sqliteTable("list", {
	id: text("id").primaryKey().$defaultFn(() => cuid()),
	createAt: integer("create_at", { mode: "timestamp" }).default(
		sql`(CURRENT_TIMESTAMP)`,
	),
	updatedAt: integer("updated_at", { mode: "timestamp" }).default(
		sql`(CURRENT_TIMESTAMP)`,
	).$onUpdateFn(() => new Date()),

	ownerId: text("owner_id").references(() => users.id).notNull(),

	name: text("name").notNull(),
	description: text("description"),
	color: text("color"),
	icon: text("icon"),
}, (table) => ({
	ownerIdIdx: index("list_owner_id_idx").on(table.ownerId),
}));

export interface List extends InferSelectModel<typeof lists> {}

export const listRelations = relations(lists, ({ one, many }) => ({
	owner: one(users, {
		fields: [lists.ownerId],
		references: [users.id],
	}),
	members: many(listMembers),
	items: many(listItems),
}));

export const listMembers = sqliteTable("list_member", {
	id: text("id").primaryKey().$defaultFn(() => cuid()),
	createAt: integer("create_at", { mode: "timestamp" }).default(
		sql`(CURRENT_TIMESTAMP)`,
	),
	updatedAt: integer("updated_at", { mode: "timestamp" }).default(
		sql`(CURRENT_TIMESTAMP)`,
	).$onUpdateFn(() => new Date()),

	userId: text("user_id").references(() => users.id).notNull(),
	listId: text("list_id").references(() => lists.id).notNull(),

	permissions: text("permissions"),
}, (table) => ({
	userIdIdx: index("list_member_user_id_idx").on(table.userId),
	listIdIdx: index("list_member_list_id_idx").on(table.listId),
}));

export interface ListMember extends InferSelectModel<typeof listMembers> {}

export const listMemberRelations = relations(listMembers, ({ one }) => ({
	list: one(lists, {
		fields: [listMembers.listId],
		references: [lists.id],
	}),
	user: one(users, {
		fields: [listMembers.userId],
		references: [users.id],
	}),
}));

export const listTags = sqliteTable("list_tag", {
	id: text("id").primaryKey().$defaultFn(() => cuid()),
	createAt: integer("create_at", { mode: "timestamp" }).default(
		sql`(CURRENT_TIMESTAMP)`,
	),
	updatedAt: integer("updated_at", { mode: "timestamp" }).default(
		sql`(CURRENT_TIMESTAMP)`,
	).$onUpdateFn(() => new Date()),

	listId: text("list_id").references(() => lists.id).notNull(),
	createdBy: text("created_by").references(() => users.id).notNull(),

	name: text("name").notNull(),
	description: text("description"),
	color: text("color"),
	icon: text("icon"),
}, (table) => ({
	createdByIdx: index("list_tag_created_by_idx").on(table.createdBy),
	listIdIdx: index("list_tag_list_id_idx").on(table.listId),
}));

export interface ListTag extends InferSelectModel<typeof listTags> {}

export const listTagRelations = relations(listTags, ({ one }) => ({
	list: one(lists, {
		fields: [listTags.listId],
		references: [lists.id],
	}),
	user: one(users, {
		fields: [listTags.createdBy],
		references: [users.id],
	}),
}));

export const listInvites = sqliteTable("list_invite", {
	id: text("id").primaryKey().$defaultFn(() => cuid()),
	createAt: integer("create_at", { mode: "timestamp" }).default(
		sql`(CURRENT_TIMESTAMP)`,
	),
	updatedAt: integer("updated_at", { mode: "timestamp" }).default(
		sql`(CURRENT_TIMESTAMP)`,
	).$onUpdateFn(() => new Date()),

	createdBy: text("created_by").references(() => users.id).notNull(),
	listId: text("list_id").references(() => lists.id).notNull(),

	permissions: text("permissions"),

	enabled: integer("enabled", { mode: "boolean" }).default(true),
	code: text("code").notNull().unique(),

	useLimit: integer("use_limit").default(1),
	useCount: integer("use_count").default(0),
}, (table) => ({
	createdByIdx: index("list_invite_created_by_idx").on(table.createdBy),
	listIdIdx: index("list_invite_list_id_idx").on(table.listId),
	codeEnabledIdx: index("list_invite_code_expired_idx").on(
		table.code,
		table.enabled,
	),
}));

export interface ListInvite extends InferSelectModel<typeof listInvites> {}

export const listInviteRelations = relations(listInvites, ({ one }) => ({
	list: one(lists, {
		fields: [listInvites.listId],
		references: [lists.id],
	}),
	user: one(users, {
		fields: [listInvites.createdBy],
		references: [users.id],
	}),
}));

export const listItems = sqliteTable("list_item", {
	id: text("id").primaryKey().$defaultFn(() => cuid()),
	createAt: integer("create_at", { mode: "timestamp" }).default(
		sql`(CURRENT_TIMESTAMP)`,
	),
	updatedAt: integer("updated_at", { mode: "timestamp" }).default(
		sql`(CURRENT_TIMESTAMP)`,
	).$onUpdateFn(() => new Date()),

	createdBy: text("created_by").references(() => users.id).notNull(),
	listId: text("list_id").references(() => lists.id).notNull(),

	name: text("name").notNull(),
	description: text("description"),
	quantity: integer("quantity"),
	price: text("price"),

	checkedAt: integer("checked_at", { mode: "timestamp" }),
}, (table) => ({
	listIdIdx: index("list_item_list_id_idx").on(table.listId),
	listIdNameIdx: index("list_item_list_id_name_idx").on(
		table.listId,
		table.name,
	),
	listIdNameCheckedAtIdx: index("list_item_list_id_name_checked_at_idx").on(
		table.listId,
		table.name,
		table.checkedAt,
	),
	createdByIdx: index("list_item_created_by_idx").on(table.createdBy),
}));

export interface ListItem extends InferSelectModel<typeof listItems> {}

export const listItemRelations = relations(listItems, ({ one }) => ({
	list: one(lists, {
		fields: [listItems.listId],
		references: [lists.id],
	}),
	user: one(users, {
		fields: [listItems.createdBy],
		references: [users.id],
	}),
}));
