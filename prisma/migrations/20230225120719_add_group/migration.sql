/*
  Warnings:

  - You are about to drop the `_FinancialGroupToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_FinancialGroupToUser` DROP FOREIGN KEY `_FinancialGroupToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_FinancialGroupToUser` DROP FOREIGN KEY `_FinancialGroupToUser_B_fkey`;

-- DropTable
DROP TABLE `_FinancialGroupToUser`;

-- CreateTable
CREATE TABLE `FinancialGroupPersonElement` (
    `groupId` INTEGER NOT NULL,
    `personId` INTEGER NOT NULL,

    PRIMARY KEY (`groupId`, `personId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FinancialGroupPersonElement` ADD CONSTRAINT `FinancialGroupPersonElement_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `FinancialGroup`(`personId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FinancialGroupPersonElement` ADD CONSTRAINT `FinancialGroupPersonElement_personId_fkey` FOREIGN KEY (`personId`) REFERENCES `FinancialPerson`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
