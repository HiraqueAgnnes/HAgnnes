CREATE TABLE `portal_operation_models` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`name_key` text NOT NULL,
	`objective` text NOT NULL,
	`vehicles` integer NOT NULL,
	`type` text NOT NULL,
	`employment` text NOT NULL,
	`created` integer NOT NULL,
	`updated` integer NOT NULL,
	`actor` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `portal_operation_models_name_key_unique` ON `portal_operation_models` (`name_key`);--> statement-breakpoint
ALTER TABLE `portal_operations` ADD `model_id` text;