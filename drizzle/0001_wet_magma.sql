PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_list` (
	`id` text PRIMARY KEY NOT NULL,
	`create_at` integer DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` integer DEFAULT (CURRENT_TIMESTAMP),
	`owner_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`color` text,
	`icon` text,
	FOREIGN KEY (`owner_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_list`("id", "create_at", "updated_at", "owner_id", "name", "description") SELECT "id", "create_at", "updated_at", "owner_id", "name", "description" FROM `list`;--> statement-breakpoint
DROP TABLE `list`;--> statement-breakpoint
ALTER TABLE `__new_list` RENAME TO `list`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `list_owner_id_idx` ON `list` (`owner_id`);