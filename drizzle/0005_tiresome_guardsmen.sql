ALTER TABLE `transactions` ADD `stripeSessionId` varchar(255);--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_stripeSessionId_unique` UNIQUE(`stripeSessionId`);