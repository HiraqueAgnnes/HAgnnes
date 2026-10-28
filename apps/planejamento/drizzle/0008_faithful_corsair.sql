CREATE TABLE `portal_opos` (
	`id` text PRIMARY KEY NOT NULL,
	`number` text NOT NULL,
	`classification` text NOT NULL,
	`employment` text NOT NULL,
	`name` text NOT NULL,
	`event_id` text,
	`operation_id` text,
	`payload` text NOT NULL,
	`filename` text NOT NULL,
	`storage_key` text NOT NULL,
	`bytes` integer NOT NULL,
	`created` integer NOT NULL,
	`updated` integer NOT NULL,
	`actor` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `portal_opos_event_id_unique` ON `portal_opos` (`event_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `portal_opos_operation_id_unique` ON `portal_opos` (`operation_id`);