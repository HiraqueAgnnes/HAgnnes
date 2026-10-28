CREATE TABLE `portal_enem_duty` (
	`id` text PRIMARY KEY NOT NULL,
	`year` integer NOT NULL,
	`day` integer NOT NULL,
	`location` text NOT NULL,
	`slot` integer NOT NULL,
	`soldier` text NOT NULL,
	`payload` text NOT NULL,
	`updated` integer NOT NULL,
	`actor` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `enem_duty_slot` ON `portal_enem_duty` (`year`,`day`,`location`,`slot`);--> statement-breakpoint
CREATE UNIQUE INDEX `enem_duty_soldier` ON `portal_enem_duty` (`year`,`day`,`soldier`);--> statement-breakpoint
CREATE TABLE `portal_enem_records` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`year` integer NOT NULL,
	`payload` text NOT NULL,
	`updated` integer NOT NULL,
	`actor` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL
);
