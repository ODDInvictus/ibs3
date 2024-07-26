-- AlterTable
ALTER TABLE `Activity` ADD COLUMN `createdById` INTEGER NULL;

-- AlterTable
ALTER TABLE `Settings` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AddForeignKey
ALTER TABLE `Activity` ADD CONSTRAINT `Activity_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
