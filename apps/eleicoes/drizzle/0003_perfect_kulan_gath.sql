CREATE TABLE `guard_sector_reports` (
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
