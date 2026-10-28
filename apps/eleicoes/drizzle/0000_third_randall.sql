CREATE TABLE `access_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`cpf` text NOT NULL,
	`entered_at` integer NOT NULL,
	`last_seen_at` integer NOT NULL,
	`ended_at` integer,
	`minutes` integer DEFAULT 0 NOT NULL
);
