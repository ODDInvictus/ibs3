/*
  Warnings:

  - A unique constraint covering the columns `[challengerId]` on the table `LeaderboardChallengerUser` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `LeaderboardChallengerUser` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Notification` MODIFY `type` ENUM('NotificationGeneric', 'ActivityNew', 'ActivityChangedDate', 'ActivityFillInReminder', 'TagActivityDescription', 'TagPhoto', 'TagCommentPhoto', 'TagCommentActivity', 'StrafbakCreate', 'StrafbakDouble', 'StrafbakkenMaster', 'LeaderboardGotBeaten', 'LeaderboardNew', 'OngeveerDeclarationApproved', 'OngeveerDeclarationDisapproved', 'AdminNoPersonalEmail', 'AdminSettingNotFound', 'AdminNotificationDeliveryFailed', 'AdminNotificationContructionFailed', 'AdminError', 'AdminShitpost') NOT NULL;

-- AlterTable
ALTER TABLE `Settings` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX `LeaderboardChallengerUser_challengerId_key` ON `LeaderboardChallengerUser`(`challengerId`);

-- CreateIndex
CREATE UNIQUE INDEX `LeaderboardChallengerUser_userId_key` ON `LeaderboardChallengerUser`(`userId`);
