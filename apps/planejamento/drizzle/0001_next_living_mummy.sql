CREATE TABLE `portal_presence` (
	`session_id` text PRIMARY KEY NOT NULL,
	`last_seen` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `portal_visits` (
	`id` text PRIMARY KEY NOT NULL,
	`created` integer NOT NULL
);
