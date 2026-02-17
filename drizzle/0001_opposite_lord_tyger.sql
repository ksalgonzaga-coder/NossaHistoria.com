CREATE TABLE `carouselPhotos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`imageUrl` text NOT NULL,
	`imageKey` varchar(255),
	`caption` varchar(255),
	`order` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `carouselPhotos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`guestName` varchar(255) NOT NULL,
	`guestEmail` varchar(320),
	`message` longtext,
	`imageUrl` text,
	`imageKey` varchar(255),
	`isApproved` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`price` decimal(10,2) NOT NULL,
	`imageUrl` text,
	`imageKey` varchar(255),
	`category` varchar(100),
	`quantity` int NOT NULL DEFAULT 1,
	`quantitySold` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`stripePaymentIntentId` varchar(255),
	`guestName` varchar(255) NOT NULL,
	`guestEmail` varchar(320),
	`amount` decimal(10,2) NOT NULL,
	`productId` int,
	`quantity` int NOT NULL DEFAULT 1,
	`status` enum('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
	`paymentMethod` varchar(50),
	`stripeResponse` longtext,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`),
	CONSTRAINT `transactions_stripePaymentIntentId_unique` UNIQUE(`stripePaymentIntentId`)
);
--> statement-breakpoint
CREATE TABLE `weddingInfo` (
	`id` int AUTO_INCREMENT NOT NULL,
	`groomName` varchar(255),
	`brideName` varchar(255),
	`weddingDate` timestamp,
	`description` text,
	`bankAccountName` varchar(255),
	`bankAccountNumber` varchar(255),
	`bankCode` varchar(50),
	`pixKey` varchar(255),
	`stripeAccountId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `weddingInfo_id` PRIMARY KEY(`id`)
);
