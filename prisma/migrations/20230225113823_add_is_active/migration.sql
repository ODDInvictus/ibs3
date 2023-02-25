/*
  Warnings:

  - Added the required column `isActive` to the `FinancialPerson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `FinancialPerson` ADD COLUMN `isActive` BOOLEAN NOT NULL;
