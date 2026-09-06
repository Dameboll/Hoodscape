CREATE TABLE `players` (
	`user_id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`display_name` text NOT NULL,
	`handle` text NOT NULL,
	`save_json` text DEFAULT '' NOT NULL,
	`x` real DEFAULT -8 NOT NULL,
	`z` real DEFAULT 22 NOT NULL,
	`yaw` real DEFAULT 0 NOT NULL,
	`pvp_mode` text DEFAULT 'safe' NOT NULL,
	`zone` text,
	`health` real DEFAULT 100 NOT NULL,
	`kills` integer DEFAULT 0 NOT NULL,
	`deaths` integer DEFAULT 0 NOT NULL,
	`last_attack_at` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_players_updated_at` ON `players` (`updated_at`);--> statement-breakpoint
CREATE INDEX `idx_players_zone_pvp` ON `players` (`zone`,`pvp_mode`);