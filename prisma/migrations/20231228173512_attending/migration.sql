-- AlterTable
ALTER TABLE `Attending` ADD COLUMN `status` ENUM('ATTENDING', 'NOT_ATTENDING', 'UNSURE', 'NO_RESPONSE') NOT NULL DEFAULT 'NO_RESPONSE';

-- AlterTable
ALTER TABLE `Settings` ALTER COLUMN `updatedAt` DROP DEFAULT;
