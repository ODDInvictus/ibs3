-- DropIndex
DROP INDEX `EmailContact_address_key` ON `EmailContact`;

-- AlterTable
ALTER TABLE `Settings` ALTER COLUMN `updatedAt` DROP DEFAULT;
