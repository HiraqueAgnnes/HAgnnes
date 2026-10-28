CREATE TABLE `officer_reports` (
	`cpf` text PRIMARY KEY NOT NULL,
	`posto` text NOT NULL,
	`nome` text NOT NULL,
	`junta` text NOT NULL,
	`zona` text NOT NULL,
	`answers` text NOT NULL,
	`submitted_at` text NOT NULL,
	`updated_at` text NOT NULL
);
