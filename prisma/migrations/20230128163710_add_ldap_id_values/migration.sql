/*
  Warnings:

  - A unique constraint covering the columns `[ldapId]` on the table `Committee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ldapId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ldapId` to the `Committee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ldapId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Committee` ADD COLUMN `ldapId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `ldapId` VARCHAR(191) NOT NULL,
    MODIFY `email` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Committee_ldapId_key` ON `Committee`(`ldapId`);

-- CreateIndex
CREATE UNIQUE INDEX `User_ldapId_key` ON `User`(`ldapId`);

-- CreateIndex
CREATE UNIQUE INDEX `User_email_key` ON `User`(`email`);
