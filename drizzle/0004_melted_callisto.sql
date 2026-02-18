CREATE TABLE `couplePaymentInfo` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bankName` varchar(100),
	`accountType` varchar(50),
	`accountHolder` varchar(255),
	`accountNumber` varchar(50),
	`routingNumber` varchar(50),
	`pixKey` varchar(255),
	`pixKeyType` varchar(50),
	`stripeConnectId` varchar(255),
	`isVerified` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `couplePaymentInfo_id` PRIMARY KEY(`id`)
);
