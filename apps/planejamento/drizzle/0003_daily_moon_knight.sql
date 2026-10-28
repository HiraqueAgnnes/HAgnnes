CREATE TABLE `portal_reference_work` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`type_id` integer NOT NULL,
	`payload` text NOT NULL,
	`updated` integer NOT NULL,
	`actor` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL
);
