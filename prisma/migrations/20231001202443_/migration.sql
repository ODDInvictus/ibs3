/*
  Warnings:

  - You are about to drop the column `iban` on the `FinancialPerson` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `FinancialPersonDataOther` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `FinancialPerson` DROP COLUMN `iban`;

-- AlterTable
ALTER TABLE `FinancialPersonDataOther` DROP COLUMN `name`,
    ADD COLUMN `iban` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `FinancialPersonDataUser` ADD COLUMN `iban` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Settings` ALTER COLUMN `updatedAt` DROP DEFAULT;
