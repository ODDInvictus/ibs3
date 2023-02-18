/*
  Warnings:

  - You are about to drop the column `amount` on the `Declaration` table. All the data in the column will be lost.
  - You are about to drop the column `ledgerId` on the `Declaration` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `price` to the `Declaration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Declaration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Sale` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Declaration` DROP FOREIGN KEY `Declaration_ledgerId_fkey`;

-- AlterTable
ALTER TABLE `Declaration` DROP COLUMN `amount`,
    DROP COLUMN `ledgerId`,
    ADD COLUMN `price` DOUBLE NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Product` ADD COLUMN `productType` VARCHAR(191) NOT NULL DEFAULT 'product';

-- AlterTable
ALTER TABLE `Sale` ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Transaction` DROP COLUMN `isActive`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `settled` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `Acquisition` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `productId` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `userId` INTEGER NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Sale` ADD CONSTRAINT `Sale_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Acquisition` ADD CONSTRAINT `Acquisition_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Acquisition` ADD CONSTRAINT `Acquisition_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Declaration` ADD CONSTRAINT `Declaration_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
