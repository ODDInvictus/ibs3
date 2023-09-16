/*
  Warnings:

  - You are about to alter the column `found` on the `Egg` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedInt`.

*/
-- AlterTable
ALTER TABLE `Egg` MODIFY `found` INTEGER UNSIGNED NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Settings` ALTER COLUMN `updatedAt` DROP DEFAULT;
