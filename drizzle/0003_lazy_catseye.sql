PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_list_invite` (
	`id` text PRIMARY KEY NOT NULL,
	`create_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`created_by` text NOT NULL,
	`list_id` text NOT NULL,
	`permissions` text,
	`enabled` integer DEFAULT true,
	`code` text NOT NULL,
	`use_limit` integer DEFAULT 1,
	`use_count` integer DEFAULT 0,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`list_id`) REFERENCES `list`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_list_invite`("id", "create_at", "updated_at", "created_by", "list_id", "permissions", "enabled", "code", "use_limit", "use_count") SELECT "id", "create_at", "updated_at", "created_by", "list_id", "permissions", "enabled", "code", "use_limit", "use_count" FROM `list_invite`;--> statement-breakpoint
DROP TABLE `list_invite`;--> statement-breakpoint
ALTER TABLE `__new_list_invite` RENAME TO `list_invite`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `list_invite_code_unique` ON `list_invite` (`code`);--> statement-breakpoint
CREATE INDEX `list_invite_created_by_idx` ON `list_invite` (`created_by`);--> statement-breakpoint
CREATE INDEX `list_invite_list_id_idx` ON `list_invite` (`list_id`);--> statement-breakpoint
CREATE INDEX `list_invite_code_expired_idx` ON `list_invite` (`code`,`enabled`);--> statement-breakpoint
CREATE TABLE `__new_list_item` (
	`id` text PRIMARY KEY NOT NULL,
	`create_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`created_by` text NOT NULL,
	`list_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`quantity` integer,
	`price` text,
	`checked_at` integer,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`list_id`) REFERENCES `list`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_list_item`("id", "create_at", "updated_at", "created_by", "list_id", "name", "description", "quantity", "price", "checked_at") SELECT "id", "create_at", "updated_at", "created_by", "list_id", "name", "description", "quantity", "price", "checked_at" FROM `list_item`;--> statement-breakpoint
DROP TABLE `list_item`;--> statement-breakpoint
ALTER TABLE `__new_list_item` RENAME TO `list_item`;--> statement-breakpoint
CREATE INDEX `list_item_list_id_idx` ON `list_item` (`list_id`);--> statement-breakpoint
CREATE INDEX `list_item_list_id_name_idx` ON `list_item` (`list_id`,`name`);--> statement-breakpoint
CREATE INDEX `list_item_list_id_name_checked_at_idx` ON `list_item` (`list_id`,`name`,`checked_at`);--> statement-breakpoint
CREATE INDEX `list_item_created_by_idx` ON `list_item` (`created_by`);--> statement-breakpoint
CREATE TABLE `__new_list_member` (
	`id` text PRIMARY KEY NOT NULL,
	`create_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`user_id` text NOT NULL,
	`list_id` text NOT NULL,
	`permissions` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`list_id`) REFERENCES `list`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_list_member`("id", "create_at", "updated_at", "user_id", "list_id", "permissions") SELECT "id", "create_at", "updated_at", "user_id", "list_id", "permissions" FROM `list_member`;--> statement-breakpoint
DROP TABLE `list_member`;--> statement-breakpoint
ALTER TABLE `__new_list_member` RENAME TO `list_member`;--> statement-breakpoint
CREATE INDEX `list_member_user_id_idx` ON `list_member` (`user_id`);--> statement-breakpoint
CREATE INDEX `list_member_list_id_idx` ON `list_member` (`list_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `list_member_user_id_list_id_idx` ON `list_member` (`user_id`,`list_id`);--> statement-breakpoint
CREATE TABLE `__new_list_tag` (
	`id` text PRIMARY KEY NOT NULL,
	`create_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`list_id` text NOT NULL,
	`created_by` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`color` text,
	`icon` text,
	FOREIGN KEY (`list_id`) REFERENCES `list`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_list_tag`("id", "create_at", "updated_at", "list_id", "created_by", "name", "description", "color", "icon") SELECT "id", "create_at", "updated_at", "list_id", "created_by", "name", "description", "color", "icon" FROM `list_tag`;--> statement-breakpoint
DROP TABLE `list_tag`;--> statement-breakpoint
ALTER TABLE `__new_list_tag` RENAME TO `list_tag`;--> statement-breakpoint
CREATE INDEX `list_tag_created_by_idx` ON `list_tag` (`created_by`);--> statement-breakpoint
CREATE INDEX `list_tag_list_id_idx` ON `list_tag` (`list_id`);--> statement-breakpoint
CREATE TABLE `__new_list` (
	`id` text PRIMARY KEY NOT NULL,
	`create_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`owner_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`color` text,
	`icon` text,
	FOREIGN KEY (`owner_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_list`("id", "create_at", "updated_at", "owner_id", "name", "description", "color", "icon") SELECT "id", "create_at", "updated_at", "owner_id", "name", "description", "color", "icon" FROM `list`;--> statement-breakpoint
DROP TABLE `list`;--> statement-breakpoint
ALTER TABLE `__new_list` RENAME TO `list`;--> statement-breakpoint
CREATE INDEX `list_owner_id_idx` ON `list` (`owner_id`);--> statement-breakpoint
CREATE TABLE `__new_session` (
	`id` text PRIMARY KEY NOT NULL,
	`create_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	`last_used_at` integer NOT NULL,
	`identifier` text NOT NULL,
	`cookie_value` text NOT NULL,
	`label` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_session`("id", "create_at", "updated_at", "user_id", "expires_at", "last_used_at", "identifier", "cookie_value", "label") SELECT "id", "create_at", "updated_at", "user_id", "expires_at", "last_used_at", "identifier", "cookie_value", "label" FROM `session`;--> statement-breakpoint
DROP TABLE `session`;--> statement-breakpoint
ALTER TABLE `__new_session` RENAME TO `session`;--> statement-breakpoint
CREATE INDEX `session_cookie_value_expires_idx` ON `session` (`cookie_value`,`expires_at`);--> statement-breakpoint
CREATE INDEX `session_user_id_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE TABLE `__new_user` (
	`id` text PRIMARY KEY NOT NULL,
	`create_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`email` text NOT NULL,
	`external_id` text NOT NULL,
	`display_name` text NOT NULL,
	`profile_picture` text
);
--> statement-breakpoint
INSERT INTO `__new_user`("id", "create_at", "updated_at", "email", "external_id", "display_name", "profile_picture") SELECT "id", "create_at", "updated_at", "email", "external_id", "display_name", "profile_picture" FROM `user`;--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
ALTER TABLE `__new_user` RENAME TO `user`;--> statement-breakpoint
CREATE UNIQUE INDEX `user_external_id_unique` ON `user` (`external_id`);--> statement-breakpoint
CREATE INDEX `user_email_idx` ON `user` (`email`);--> statement-breakpoint
CREATE INDEX `user_external_id_idx` ON `user` (`external_id`);