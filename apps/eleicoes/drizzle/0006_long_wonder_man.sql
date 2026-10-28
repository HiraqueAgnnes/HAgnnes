CREATE TABLE `copom_records` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`date` text NOT NULL,
	`time` text NOT NULL,
	`city` text NOT NULL,
	`neighborhood` text NOT NULL,
	`opm` text NOT NULL,
	`crime` text NOT NULL,
	`solution` text NOT NULL,
	`referral` text NOT NULL,
	`created_by` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_by` text NOT NULL,
	`updated_at` text NOT NULL
);
