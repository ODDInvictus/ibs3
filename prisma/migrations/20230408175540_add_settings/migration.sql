-- CreateTable
CREATE TABLE `Settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Settings_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT IGNORE INTO `Settings` (`name`, `description`, `value`)
VALUES ('VERSION', 'Huidige versie van IBS', 'v1.0.4'),
       ('GIT_COMMIT', 'Huidige commit', 'abcdefg'),
       ('GIT_COMMIT_SHORT', 'Huidige commit (kort)', 'abcdefg'),
       ('COLOSSEUM_IP', 'Adres-range lokaal', '192.168.'),
       ('CAMPUS_IP', 'Adres-range van de campus', '130.89'),
       ('GITHUB_LINK', 'Link naar de GitHub repository', 'https://github.com/ODDInvictus/ibs3'),
       ('DISCORD_NOTIFICATION_WEBHOOK', 'Link naar de Discord webhook', 'https://discord.com/api/webhooks/'),
       ('DISCORD_NOTIFICATION_CHANNEL', 'ID van de Discord channel', '000000000000000000'),
       ('DISCORD_NOTIFICATION_ENABLED', 'Of de Discord notificaties aanstaan', '1'),
       ('MALUSPUNTEN_ENABLED', 'Of de maluspunten module aan staat', '1');