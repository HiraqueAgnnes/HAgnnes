CREATE TABLE `copom_records_t2` (
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
--> statement-breakpoint
CREATE TABLE `guard_sector_reports_t2` (
	`id` text PRIMARY KEY NOT NULL,
	`cpf` text NOT NULL,
	`area` text NOT NULL,
	`setor` text NOT NULL,
	`posto` text NOT NULL,
	`nome` text NOT NULL,
	`answers` text NOT NULL,
	`attendance` text NOT NULL,
	`submitted_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `officer_reports_t2` (
	`cpf` text PRIMARY KEY NOT NULL,
	`posto` text NOT NULL,
	`nome` text NOT NULL,
	`junta` text NOT NULL,
	`zona` text NOT NULL,
	`answers` text NOT NULL,
	`submitted_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `report_availability_t2` (
	`kind` text PRIMARY KEY NOT NULL,
	`enabled` integer NOT NULL,
	`updated_by` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `vehicle_assignments_t2` (
	`id` text PRIMARY KEY NOT NULL,
	`task` text NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`area` text NOT NULL,
	`setor` text NOT NULL,
	`base` text NOT NULL,
	`type` text NOT NULL,
	`model` text NOT NULL,
	`plate` text NOT NULL,
	`updated_by` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `vote_sector_reports_t2` (
	`id` text PRIMARY KEY NOT NULL,
	`cpf` text NOT NULL,
	`area` text NOT NULL,
	`setor` text NOT NULL,
	`posto` text NOT NULL,
	`nome` text NOT NULL,
	`answers` text NOT NULL,
	`attendance` text NOT NULL,
	`submitted_at` text NOT NULL,
	`updated_at` text NOT NULL
);
