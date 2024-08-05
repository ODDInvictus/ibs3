/*
  Warnings:

  - You are about to drop the column `isAttending` on the `Attending` table. All the data in the column will be lost.
  - You are about to drop the column `activityImageId` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `extension` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `filename` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `processed` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `profilePictureId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `JournalAttachments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PhotoCreator` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `fileId` to the `Photo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `JournalAttachments` DROP FOREIGN KEY `JournalAttachments_journalId_fkey`;

-- DropForeignKey
ALTER TABLE `LinkClick` DROP FOREIGN KEY `LinkClick_linkId_fkey`;

-- DropForeignKey
ALTER TABLE `Photo` DROP FOREIGN KEY `Photo_activityImageId_fkey`;

-- DropForeignKey
ALTER TABLE `Photo` DROP FOREIGN KEY `Photo_creatorId_fkey`;

-- DropForeignKey
ALTER TABLE `PhotoCreator` DROP FOREIGN KEY `PhotoCreator_userId_fkey`;

-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_profilePictureId_fkey`;

-- DropIndex
DROP INDEX `Photo_filename_key` ON `Photo`;

-- AlterTable
ALTER TABLE `Activity` ADD COLUMN `photo` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Attending` DROP COLUMN `isAttending`;

-- AlterTable
ALTER TABLE `Photo` DROP COLUMN `activityImageId`,
    DROP COLUMN `extension`,
    DROP COLUMN `filename`,
    DROP COLUMN `processed`,
    ADD COLUMN `fileId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Settings` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `profilePictureId`,
    ADD COLUMN `profilePicture` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `JournalAttachments`;

-- DropTable
DROP TABLE `PhotoCreator`;

-- CreateTable
CREATE TABLE `File` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `filename` VARCHAR(191) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `uploaderId` INTEGER NULL,
    `journalId` INTEGER NULL,

    UNIQUE INDEX `File_filename_key`(`filename`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Job` (
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `data` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `finished` BOOLEAN NOT NULL DEFAULT false,
    `completedAt` DATETIME(3) NULL,
    `result` VARCHAR(191) NULL,

    PRIMARY KEY (`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LinkClick` ADD CONSTRAINT `LinkClick_linkId_fkey` FOREIGN KEY (`linkId`) REFERENCES `Link`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Photo` ADD CONSTRAINT `Photo_fileId_fkey` FOREIGN KEY (`fileId`) REFERENCES `File`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Photo` ADD CONSTRAINT `Photo_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_uploaderId_fkey` FOREIGN KEY (`uploaderId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_journalId_fkey` FOREIGN KEY (`journalId`) REFERENCES `Journal`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
