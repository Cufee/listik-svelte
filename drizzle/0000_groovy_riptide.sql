CREATE TABLE `list_invite` (
	`id` text PRIMARY KEY NOT NULL,
	`create_at` integer DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` integer DEFAULT (CURRENT_TIMESTAMP),
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
CREATE UNIQUE INDEX `list_invite_code_unique` ON `list_invite` (`code`);--> statement-breakpoint
CREATE INDEX `list_invite_created_by_idx` ON `list_invite` (`created_by`);--> statement-breakpoint
CREATE INDEX `list_invite_list_id_idx` ON `list_invite` (`list_id`);--> statement-breakpoint
CREATE INDEX `list_invite_code_expired_idx` ON `list_invite` (`code`,`enabled`);--> statement-breakpoint
CREATE TABLE `list_item` (
	`id` text PRIMARY KEY NOT NULL,
	`create_at` integer DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` integer DEFAULT (CURRENT_TIMESTAMP),
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
CREATE INDEX `list_item_list_id_idx` ON `list_item` (`list_id`);--> statement-breakpoint
CREATE INDEX `list_item_list_id_name_idx` ON `list_item` (`list_id`,`name`);--> statement-breakpoint
CREATE INDEX `list_item_list_id_name_checked_at_idx` ON `list_item` (`list_id`,`name`,`checked_at`);--> statement-breakpoint
CREATE INDEX `list_item_created_by_idx` ON `list_item` (`created_by`);--> statement-breakpoint
CREATE TABLE `list_member` (
	`id` text PRIMARY KEY NOT NULL,
	`create_at` integer DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` integer DEFAULT (CURRENT_TIMESTAMP),
	`user_id` text NOT NULL,
	`list_id` text NOT NULL,
	`permissions` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`list_id`) REFERENCES `list`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `list_member_user_id_idx` ON `list_member` (`user_id`);--> statement-breakpoint
CREATE INDEX `list_member_list_id_idx` ON `list_member` (`list_id`);--> statement-breakpoint
CREATE TABLE `list_tag` (
	`id` text PRIMARY KEY NOT NULL,
	`create_at` integer DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` integer DEFAULT (CURRENT_TIMESTAMP),
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
CREATE INDEX `list_tag_created_by_idx` ON `list_tag` (`created_by`);--> statement-breakpoint
CREATE INDEX `list_tag_list_id_idx` ON `list_tag` (`list_id`);--> statement-breakpoint
CREATE TABLE `list` (
	`id` text PRIMARY KEY NOT NULL,
	`create_at` integer DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` integer DEFAULT (CURRENT_TIMESTAMP),
	`owner_id` text,
	`name` text NOT NULL,
	`description` text,
	FOREIGN KEY (`owner_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `list_owner_id_idx` ON `list` (`owner_id`);--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`create_at` integer DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` integer DEFAULT (CURRENT_TIMESTAMP),
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	`last_used_at` integer NOT NULL,
	`identifier` text NOT NULL,
	`cookie_value` text NOT NULL,
	`label` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `session_cookie_value_expires_idx` ON `session` (`cookie_value`,`expires_at`);--> statement-breakpoint
CREATE INDEX `session_user_id_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`create_at` integer DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` integer DEFAULT (CURRENT_TIMESTAMP),
	`email` text NOT NULL,
	`external_id` text NOT NULL,
	`display_name` text NOT NULL,
	`profile_picture` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_external_id_unique` ON `user` (`external_id`);--> statement-breakpoint
CREATE INDEX `user_email_idx` ON `user` (`email`);--> statement-breakpoint
CREATE INDEX `user_external_id_idx` ON `user` (`external_id`);