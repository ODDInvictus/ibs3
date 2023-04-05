/*
  Warnings:

  - You are about to alter the column `balance` on the `FinancialPerson` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `FinancialPerson` MODIFY `balance` DOUBLE NOT NULL DEFAULT 0;
