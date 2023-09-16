/*
  Warnings:

  - You are about to alter the column `found` on the `Egg` table. The data in that column could be lost. The data in that column will be cast from `UnsignedInt` to `LongBlob`.

*/
-- AlterTable
ALTER TABLE `Egg` MODIFY `found` LONGBLOB NOT NULL;

-- AlterTable
ALTER TABLE `Settings` ALTER COLUMN `updatedAt` DROP DEFAULT;
