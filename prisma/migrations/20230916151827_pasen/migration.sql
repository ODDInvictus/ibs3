-- AlterTable
ALTER TABLE `Settings` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- CreateTable
CREATE TABLE `Egg` (
    `id` VARCHAR(191) NOT NULL,
    `found` INTEGER NOT NULL DEFAULT 0,
    `name` VARCHAR(191) NOT NULL,
    `img` VARCHAR(191) NOT NULL DEFAULT 'egg1.png',

    UNIQUE INDEX `Egg_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
