-- DropForeignKey
ALTER TABLE `EmailAliasCommittee` DROP FOREIGN KEY `EmailAliasCommittee_committeeId_fkey`;

-- DropForeignKey
ALTER TABLE `EmailAliasCommittee` DROP FOREIGN KEY `EmailAliasCommittee_emailAliasId_fkey`;

-- DropForeignKey
ALTER TABLE `EmailAliasUser` DROP FOREIGN KEY `EmailAliasUser_emailAliasId_fkey`;

-- DropForeignKey
ALTER TABLE `EmailAliasUser` DROP FOREIGN KEY `EmailAliasUser_userId_fkey`;

-- DropForeignKey
ALTER TABLE `EmailContact` DROP FOREIGN KEY `EmailContact_emailAliasId_fkey`;

-- AlterTable
ALTER TABLE `Settings` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AddForeignKey
ALTER TABLE `EmailAliasCommittee` ADD CONSTRAINT `EmailAliasCommittee_emailAliasId_fkey` FOREIGN KEY (`emailAliasId`) REFERENCES `EmailAlias`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmailAliasCommittee` ADD CONSTRAINT `EmailAliasCommittee_committeeId_fkey` FOREIGN KEY (`committeeId`) REFERENCES `Committee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmailAliasUser` ADD CONSTRAINT `EmailAliasUser_emailAliasId_fkey` FOREIGN KEY (`emailAliasId`) REFERENCES `EmailAlias`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmailAliasUser` ADD CONSTRAINT `EmailAliasUser_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmailContact` ADD CONSTRAINT `EmailContact_emailAliasId_fkey` FOREIGN KEY (`emailAliasId`) REFERENCES `EmailAlias`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
