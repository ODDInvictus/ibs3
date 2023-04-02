-- AlterTable
ALTER TABLE `Sale` ADD COLUMN `streeplijstId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Streeplijst` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `personId` INTEGER NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Sale` ADD CONSTRAINT `Sale_streeplijstId_fkey` FOREIGN KEY (`streeplijstId`) REFERENCES `Streeplijst`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Streeplijst` ADD CONSTRAINT `Streeplijst_personId_fkey` FOREIGN KEY (`personId`) REFERENCES `FinancialPerson`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
