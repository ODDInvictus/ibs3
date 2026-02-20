/*
  Warnings:

  - The primary key for the `Attending` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Attending` table. All the data in the column will be lost.
  - The primary key for the `BasePreference` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `BasePreference` table. All the data in the column will be lost.
  - You are about to drop the column `receiverId` on the `Notification` table. All the data in the column will be lost.
  - The values [TagActivityDescription,TagPhoto,TagCommentPhoto,TagCommentActivity,StrafbakkenMaster,LeaderboardNew,OngeveerDeclarationApproved,OngeveerDeclarationDisapproved,AdminNotificationDeliveryFailed] on the enum `Notification_type` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `baseId` on the `Preference` table. All the data in the column will be lost.
  - You are about to drop the `NotificationReceiver` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `ActivityLocation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[key]` on the table `BasePreference` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[challengerId]` on the table `LeaderboardChallengerUser` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `LeaderboardChallengerUser` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `baseKey` to the `Preference` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Notification` DROP FOREIGN KEY `Notification_receiverId_fkey`;

-- DropForeignKey
ALTER TABLE `NotificationReceiver` DROP FOREIGN KEY `NotificationReceiver_receiverId_fkey`;

-- DropForeignKey
ALTER TABLE `Preference` DROP FOREIGN KEY `Preference_baseId_fkey`;

-- DropForeignKey
ALTER TABLE `Preference` DROP FOREIGN KEY `Preference_userId_fkey`;

-- DropIndex
DROP INDEX `Notification_receiverId_fkey` ON `Notification`;

-- DropIndex
DROP INDEX `Preference_baseId_fkey` ON `Preference`;

-- DropIndex
DROP INDEX `Preference_userId_fkey` ON `Preference`;

-- AlterTable
ALTER TABLE `Activity` ADD COLUMN `activityPhotoId` INTEGER NULL;

-- AlterTable
ALTER TABLE `ActivityLocation` MODIFY `adress` VARCHAR(191) NULL,
    MODIFY `country` VARCHAR(191) NULL,
    MODIFY `postalCode` VARCHAR(191) NULL,
    MODIFY `city` VARCHAR(191) NULL,
    MODIFY `description` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Attending` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`userId`, `activityId`);

-- AlterTable
ALTER TABLE `BasePreference` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`key`);

-- AlterTable
ALTER TABLE `Notification` DROP COLUMN `receiverId`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `discord` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `failed` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `userId` INTEGER NULL,
    MODIFY `body` TEXT NULL,
    MODIFY `type` ENUM('NotificationGeneric', 'ActivityNew', 'ActivityChangedDate', 'ActivityFillInReminder', 'StrafbakCreate', 'StrafbakDouble', 'StrafbakMaster', 'StrafbakNoStrafbak', 'LeaderboardGotBeaten', 'AdminNoPersonalEmail', 'AdminSettingNotFound', 'AdminError', 'AdminShitpost') NOT NULL,
    MODIFY `sent` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Preference` DROP COLUMN `baseId`,
    ADD COLUMN `baseKey` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Settings` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `discordUsername` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `NotificationReceiver`;

-- CreateTable
CREATE TABLE `DiscordMessage` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `sender` VARCHAR(191) NOT NULL,
    `text` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Quote` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `text` TEXT NOT NULL,
    `msgId` VARCHAR(191) NULL,
    `quoteeId` INTEGER NULL,
    `quoterId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `ActivityLocation_name_key` ON `ActivityLocation`(`name`);

-- CreateIndex
CREATE FULLTEXT INDEX `ActivityLocation_name_idx` ON `ActivityLocation`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `BasePreference_key_key` ON `BasePreference`(`key`);

-- CreateIndex
CREATE UNIQUE INDEX `LeaderboardChallengerUser_challengerId_key` ON `LeaderboardChallengerUser`(`challengerId`);

-- CreateIndex
CREATE UNIQUE INDEX `LeaderboardChallengerUser_userId_key` ON `LeaderboardChallengerUser`(`userId`);

-- AddForeignKey
ALTER TABLE `Preference` ADD CONSTRAINT `Preference_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Preference` ADD CONSTRAINT `Preference_baseKey_fkey` FOREIGN KEY (`baseKey`) REFERENCES `BasePreference`(`key`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Activity` ADD CONSTRAINT `Activity_activityPhotoId_fkey` FOREIGN KEY (`activityPhotoId`) REFERENCES `Photo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quote` ADD CONSTRAINT `Quote_msgId_fkey` FOREIGN KEY (`msgId`) REFERENCES `DiscordMessage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quote` ADD CONSTRAINT `Quote_quoteeId_fkey` FOREIGN KEY (`quoteeId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quote` ADD CONSTRAINT `Quote_quoterId_fkey` FOREIGN KEY (`quoterId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
