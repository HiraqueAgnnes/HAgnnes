CREATE TABLE `portal_conduct_terms` (
	`id` text PRIMARY KEY NOT NULL,
	`category` text NOT NULL,
	`subject` text NOT NULL,
	`date` text NOT NULL,
	`status` text NOT NULL,
	`filename` text NOT NULL,
	`storage_key` text NOT NULL,
	`bytes` integer NOT NULL,
	`created` integer NOT NULL,
	`updated` integer NOT NULL,
	`actor` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL
);
