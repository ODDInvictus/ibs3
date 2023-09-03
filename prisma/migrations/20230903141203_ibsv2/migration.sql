/*
  Warnings:

  - You are about to drop the column `image` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `picture` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Activity` DROP COLUMN `image`;

-- AlterTable
ALTER TABLE `Settings` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `picture`,
    ADD COLUMN `preferredTheme` VARCHAR(191) NOT NULL DEFAULT 'light',
    ADD COLUMN `profilePictureId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Photo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `date` DATETIME(3) NULL,
    `visible` BOOLEAN NOT NULL DEFAULT true,
    `filename` VARCHAR(191) NOT NULL,
    `extension` VARCHAR(191) NOT NULL,
    `processed` BOOLEAN NOT NULL DEFAULT false,
    `description` VARCHAR(191) NULL,
    `uploaderId` INTEGER NULL,
    `creatorId` INTEGER NULL,
    `activityImageId` INTEGER NULL,
    `activityPhotoId` INTEGER NULL,

    UNIQUE INDEX `Photo_filename_key`(`filename`),
    UNIQUE INDEX `Photo_activityImageId_key`(`activityImageId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PhotoCreator` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `PhotoCreator_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PhotoTag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `PhotoTag_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PhotosWithTags` (
    `photoId` INTEGER NOT NULL,
    `photoTagId` INTEGER NOT NULL,
    `assignedById` INTEGER NULL,

    PRIMARY KEY (`photoId`, `photoTagId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PhotoPersonTag` (
    `taggerId` INTEGER NULL,
    `photoId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`photoId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PhotoRating` (
    `rating` INTEGER NOT NULL DEFAULT 1,
    `photoId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`photoId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `comment` LONGTEXT NOT NULL,
    `commenterId` INTEGER NOT NULL,
    `photoId` INTEGER NULL,
    `activityId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_profilePictureId_fkey` FOREIGN KEY (`profilePictureId`) REFERENCES `Photo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Photo` ADD CONSTRAINT `Photo_uploaderId_fkey` FOREIGN KEY (`uploaderId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Photo` ADD CONSTRAINT `Photo_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `PhotoCreator`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Photo` ADD CONSTRAINT `Photo_activityImageId_fkey` FOREIGN KEY (`activityImageId`) REFERENCES `Activity`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Photo` ADD CONSTRAINT `Photo_activityPhotoId_fkey` FOREIGN KEY (`activityPhotoId`) REFERENCES `Activity`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PhotoCreator` ADD CONSTRAINT `PhotoCreator_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PhotosWithTags` ADD CONSTRAINT `PhotosWithTags_photoId_fkey` FOREIGN KEY (`photoId`) REFERENCES `Photo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PhotosWithTags` ADD CONSTRAINT `PhotosWithTags_photoTagId_fkey` FOREIGN KEY (`photoTagId`) REFERENCES `PhotoTag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PhotosWithTags` ADD CONSTRAINT `PhotosWithTags_assignedById_fkey` FOREIGN KEY (`assignedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PhotoPersonTag` ADD CONSTRAINT `PhotoPersonTag_taggerId_fkey` FOREIGN KEY (`taggerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PhotoPersonTag` ADD CONSTRAINT `PhotoPersonTag_photoId_fkey` FOREIGN KEY (`photoId`) REFERENCES `Photo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PhotoPersonTag` ADD CONSTRAINT `PhotoPersonTag_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PhotoRating` ADD CONSTRAINT `PhotoRating_photoId_fkey` FOREIGN KEY (`photoId`) REFERENCES `Photo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PhotoRating` ADD CONSTRAINT `PhotoRating_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_commenterId_fkey` FOREIGN KEY (`commenterId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_photoId_fkey` FOREIGN KEY (`photoId`) REFERENCES `Photo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `Activity`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
