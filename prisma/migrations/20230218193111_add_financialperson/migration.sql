-- CreateTable
CREATE TABLE `FinancialPerson` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('USER', 'GROUP', 'ACTIVITY', 'INVICTUS', 'COMMITTEE', 'OTHER') NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `balance` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FinancialPersonDataUser` (
    `personId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`personId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FinancialGroup` (
    `personId` INTEGER NOT NULL,

    PRIMARY KEY (`personId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FinancialPersonDataActivity` (
    `personId` INTEGER NOT NULL,
    `activityId` INTEGER NOT NULL,

    PRIMARY KEY (`personId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FinancialPersonDataCommittee` (
    `personId` INTEGER NOT NULL,
    `committeeId` INTEGER NOT NULL,

    PRIMARY KEY (`personId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FinancialPersonDataOther` (
    `personId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`personId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_FinancialGroupToUser` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_FinancialGroupToUser_AB_unique`(`A`, `B`),
    INDEX `_FinancialGroupToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FinancialPersonDataUser` ADD CONSTRAINT `FinancialPersonDataUser_personId_fkey` FOREIGN KEY (`personId`) REFERENCES `FinancialPerson`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FinancialPersonDataUser` ADD CONSTRAINT `FinancialPersonDataUser_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FinancialGroup` ADD CONSTRAINT `FinancialGroup_personId_fkey` FOREIGN KEY (`personId`) REFERENCES `FinancialPerson`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FinancialPersonDataActivity` ADD CONSTRAINT `FinancialPersonDataActivity_personId_fkey` FOREIGN KEY (`personId`) REFERENCES `FinancialPerson`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FinancialPersonDataActivity` ADD CONSTRAINT `FinancialPersonDataActivity_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `Activity`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FinancialPersonDataCommittee` ADD CONSTRAINT `FinancialPersonDataCommittee_personId_fkey` FOREIGN KEY (`personId`) REFERENCES `FinancialPerson`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FinancialPersonDataCommittee` ADD CONSTRAINT `FinancialPersonDataCommittee_committeeId_fkey` FOREIGN KEY (`committeeId`) REFERENCES `Committee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FinancialPersonDataOther` ADD CONSTRAINT `FinancialPersonDataOther_personId_fkey` FOREIGN KEY (`personId`) REFERENCES `FinancialPerson`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FinancialGroupToUser` ADD CONSTRAINT `_FinancialGroupToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `FinancialGroup`(`personId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FinancialGroupToUser` ADD CONSTRAINT `_FinancialGroupToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
