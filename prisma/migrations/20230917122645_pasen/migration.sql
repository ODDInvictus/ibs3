-- CreateTable
CREATE TABLE `Egg` (
    `id` VARCHAR(191) NOT NULL,
    `img` VARCHAR(191) NOT NULL DEFAULT 'egg1.png',
    `name` VARCHAR(191) NOT NULL DEFAULT 'Egg',
    `found` TINYBLOB NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Egg_name_key` ON `Egg`(`name`);

INSERT IGNORE INTO `Egg` (`id`, `name`, `found`) 
VALUES  ('HX1aAqX25B4lo1FQgNUeKjPEGH53r5byWc0Id6gmwkPeevvG7N', 'urEI', 0x0), 
        ('UWn89YWEeurHH6NfeUFYBaewEu88uhl2iWTCh4OP18VguRs078', 'spEItify', 0x0),
        ('ZX0cAYFXqIyMQQz4cVmgVI7vRZfx3Fb9EH1lHZUAHPp4qVlSNN', 'strEIbos', 0x0),
        ('xkzR2iH1Ut4kwoT8G53vlxFoRQqfZLrKESLO7lFygpSMiPfDk7', 'Markdown', 0x0),
        ('FDaR8VJklWZdZX9qYMabhAJlR9wWWU7gPgagGfZG8AbckOY27T', 'profEIl', 0x0),
        ('3BoXkqmZITrIkVQ2WzaFXTROlx8VxjRKinjWcz6H1LLdVfZnLP', 'tutorEIal', 0x0),
        ('HnSF3i41PdqTzUpvmO7S0RwiB7RA6el5nfRUBAY7IhJVAK0DkT', 'Menu Ei', 0x0),
        ('wCZXlGQDecVPXIrQyz8lmR8BLpe730hTPu0mEVcFetBPjWXxwH', '100 Kliks', 0x0),
        ('Zask8Z6FdyZwxFQkwwUrPAUd53he7ydiLW1lJezA1mg0m7zm7O', 'instEIlingen', 0x0);


INSERT IGNORE INTO `Settings` (`name`, `description`, `value`) VALUES ('EGGHUNT_ENABLED', 'Of het paasei zoeken aan staat', '0');
