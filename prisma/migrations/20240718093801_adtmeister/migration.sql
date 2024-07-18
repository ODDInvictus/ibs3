-- AlterTable
ALTER TABLE `Leaderboard` MODIFY `type` ENUM('SCORE', 'COUNT', 'TIME', 'ADTMEISTER') NOT NULL;

-- AlterTable
ALTER TABLE `Settings` ALTER COLUMN `updatedAt` DROP DEFAULT;
