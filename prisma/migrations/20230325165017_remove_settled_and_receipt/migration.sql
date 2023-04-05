/*
  Warnings:

  - You are about to drop the column `settled` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `purchaseLocation` to the `Acquisition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receipt` to the `Acquisition` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Acquisition` ADD COLUMN `purchaseLocation` VARCHAR(191) NOT NULL,
    ADD COLUMN `receipt` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Declaration` ADD COLUMN `receipt` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `FinancialPerson` MODIFY `type` ENUM('USER', 'GROUP', 'ACTIVITY', 'COMMITTEE', 'INVICTUS', 'OTHER') NOT NULL;

-- AlterTable
ALTER TABLE `Transaction` DROP COLUMN `settled`;
