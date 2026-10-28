CREATE TABLE `portal_intelligence` (
	`event_id` text PRIMARY KEY NOT NULL,
	`content` text DEFAULT '' NOT NULL,
	`file_id` text,
	`sent_content` text,
	`sent_file_id` text,
	`sent_at` integer,
	`updated` integer NOT NULL,
	`actor` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL
);
