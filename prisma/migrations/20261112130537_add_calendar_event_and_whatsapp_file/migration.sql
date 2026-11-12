/*
  Warnings:

  - A unique constraint covering the columns `[whatsappJid]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `whatsappJid` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `CalendarEvent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,
    `createdById` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CalendarEventUser` (
    `eventId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`eventId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WhatsappFileUpload` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `chatJid` VARCHAR(191) NOT NULL,
    `userJid` VARCHAR(191) NOT NULL,
    `caption` VARCHAR(191) NULL,
    `fileId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WhatsappJid` (
    `jid` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`jid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_whatsappJid_key` ON `User`(`whatsappJid`);

-- AddForeignKey
ALTER TABLE `CalendarEvent` ADD CONSTRAINT `CalendarEvent_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CalendarEventUser` ADD CONSTRAINT `CalendarEventUser_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `CalendarEvent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CalendarEventUser` ADD CONSTRAINT `CalendarEventUser_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WhatsappFileUpload` ADD CONSTRAINT `WhatsappFileUpload_chatJid_fkey` FOREIGN KEY (`chatJid`) REFERENCES `WhatsappJid`(`jid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WhatsappFileUpload` ADD CONSTRAINT `WhatsappFileUpload_userJid_fkey` FOREIGN KEY (`userJid`) REFERENCES `WhatsappJid`(`jid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WhatsappFileUpload` ADD CONSTRAINT `WhatsappFileUpload_fileId_fkey` FOREIGN KEY (`fileId`) REFERENCES `File`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
