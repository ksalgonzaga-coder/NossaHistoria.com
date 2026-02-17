CREATE TABLE `eventGalleryComments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`photoId` int NOT NULL,
	`guestName` varchar(255) NOT NULL,
	`guestEmail` varchar(320),
	`comment` text NOT NULL,
	`isApproved` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `eventGalleryComments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `eventGalleryLikes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`photoId` int NOT NULL,
	`guestEmail` varchar(320) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `eventGalleryLikes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `eventGalleryPhotos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`imageUrl` text NOT NULL,
	`imageKey` varchar(255),
	`caption` text,
	`likes` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `eventGalleryPhotos_id` PRIMARY KEY(`id`)
);
