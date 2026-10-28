CREATE TABLE `portal_operations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`date` text NOT NULL,
	`end_date` text NOT NULL,
	`unit` text NOT NULL,
	`start_time` text NOT NULL,
	`end_time` text NOT NULL,
	`created` integer NOT NULL,
	`updated` integer NOT NULL,
	`actor` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL
);
