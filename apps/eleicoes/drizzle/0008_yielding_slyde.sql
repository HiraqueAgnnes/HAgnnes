CREATE TABLE `attendance_checks_t2` (
	`id` text PRIMARY KEY NOT NULL,
	`service` text NOT NULL,
	`assignment_id` text NOT NULL,
	`location_id` text NOT NULL,
	`cpf` text NOT NULL,
	`area` text NOT NULL,
	`setor` text NOT NULL,
	`nome` text NOT NULL,
	`posto` text NOT NULL,
	`attendance` text NOT NULL,
	`revision` integer NOT NULL,
	`updated_at` text NOT NULL
);
