/*
  Warnings:

  - You are about to drop the column `userId` on the `Acquisition` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Declaration` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `productType` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - You are about to drop the column `userId` on the `Sale` table. All the data in the column will be lost.
  - Added the required column `personId` to the `Acquisition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `personId` to the `Declaration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `personId` to the `Sale` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Acquisition` DROP FOREIGN KEY `Acquisition_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Declaration` DROP FOREIGN KEY `Declaration_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Sale` DROP FOREIGN KEY `Sale_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_fromId_fkey`;

-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_toId_fkey`;

-- AlterTable
ALTER TABLE `Acquisition` DROP COLUMN `userId`,
    ADD COLUMN `personId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Declaration` DROP COLUMN `userId`,
    ADD COLUMN `personId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Product` MODIFY `price` DOUBLE NOT NULL,
    MODIFY `productType` ENUM('ALCOHOL', 'FOOD', 'OTHER') NOT NULL DEFAULT 'OTHER';

-- AlterTable
ALTER TABLE `Sale` DROP COLUMN `userId`,
    ADD COLUMN `personId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_fromId_fkey` FOREIGN KEY (`fromId`) REFERENCES `FinancialPerson`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_toId_fkey` FOREIGN KEY (`toId`) REFERENCES `FinancialPerson`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sale` ADD CONSTRAINT `Sale_personId_fkey` FOREIGN KEY (`personId`) REFERENCES `FinancialPerson`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Acquisition` ADD CONSTRAINT `Acquisition_personId_fkey` FOREIGN KEY (`personId`) REFERENCES `FinancialPerson`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Declaration` ADD CONSTRAINT `Declaration_personId_fkey` FOREIGN KEY (`personId`) REFERENCES `FinancialPerson`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
