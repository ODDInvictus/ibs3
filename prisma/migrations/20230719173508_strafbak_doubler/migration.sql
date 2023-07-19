-- DropForeignKey
ALTER TABLE `Strafbak` DROP FOREIGN KEY `Strafbak_giverId_fkey`;

-- AlterTable
ALTER TABLE `Settings` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `Strafbak` MODIFY `giverId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Strafbak` ADD CONSTRAINT `Strafbak_giverId_fkey` FOREIGN KEY (`giverId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
