-- AlterTable
ALTER TABLE `LeaderboardEntry` ADD COLUMN `challengerId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Settings` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- CreateTable
CREATE TABLE `LeaderboardChallenger` (
    `id` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LeaderboardChallengerUser` (
    `challengerId` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`challengerId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `body` VARCHAR(191) NOT NULL,
    `type` ENUM('NotificationGeneric', 'ActivityNew', 'ActivityChangedDate', 'ActivityFillInReminder', 'TagActivityDescription', 'TagPhoto', 'TagCommentPhoto', 'TagCommentActivity', 'StrafbakCreate', 'StrafbakDouble', 'StrafbakkenMaster', 'LeaderboardGotBeaten', 'LeaderboardNew', 'OngeveerDeclarationApproved', 'OngeveerDeclarationDisapproved', 'AdminNoPersonalEmail', 'AdminSettingNotFound', 'AdminNotificationDeliveryFailed', 'AdminError', 'AdminShitpost') NOT NULL,
    `sent` BOOLEAN NOT NULL,
    `receiverId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NotificationReceiver` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `receiverId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LeaderboardEntry` ADD CONSTRAINT `LeaderboardEntry_challengerId_fkey` FOREIGN KEY (`challengerId`) REFERENCES `LeaderboardChallenger`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeaderboardChallengerUser` ADD CONSTRAINT `LeaderboardChallengerUser_challengerId_fkey` FOREIGN KEY (`challengerId`) REFERENCES `LeaderboardChallenger`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeaderboardChallengerUser` ADD CONSTRAINT `LeaderboardChallengerUser_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `NotificationReceiver`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotificationReceiver` ADD CONSTRAINT `NotificationReceiver_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
