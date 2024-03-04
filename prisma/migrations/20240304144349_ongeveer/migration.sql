/*
  Warnings:

  - You are about to drop the column `name` on the `FinancialPersonDataOther` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Streeplijst` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Streeplijst` table. All the data in the column will be lost.
  - You are about to drop the column `personId` on the `Streeplijst` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `fromId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `ledgerId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `toId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the `Acquisition` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Declaration` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Sale` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Acquisition` DROP FOREIGN KEY `Acquisition_personId_fkey`;

-- DropForeignKey
ALTER TABLE `Acquisition` DROP FOREIGN KEY `Acquisition_productId_fkey`;

-- DropForeignKey
ALTER TABLE `Declaration` DROP FOREIGN KEY `Declaration_personId_fkey`;

-- DropForeignKey
ALTER TABLE `FinancialPersonDataOther` DROP FOREIGN KEY `FinancialPersonDataOther_personId_fkey`;

-- DropForeignKey
ALTER TABLE `Sale` DROP FOREIGN KEY `Sale_personId_fkey`;

-- DropForeignKey
ALTER TABLE `Sale` DROP FOREIGN KEY `Sale_productId_fkey`;

-- DropForeignKey
ALTER TABLE `Sale` DROP FOREIGN KEY `Sale_streeplijstId_fkey`;

-- DropForeignKey
ALTER TABLE `Streeplijst` DROP FOREIGN KEY `Streeplijst_personId_fkey`;

-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_fromId_fkey`;

-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_ledgerId_fkey`;

-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_toId_fkey`;

-- AlterTable
ALTER TABLE `FinancialPerson` MODIFY `balance` DECIMAL(19, 4) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `FinancialPersonDataOther` DROP COLUMN `name`,
    ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `city` VARCHAR(191) NULL,
    ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `iban` VARCHAR(191) NULL,
    ADD COLUMN `postalCode` VARCHAR(191) NULL,
    MODIFY `description` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `FinancialPersonDataUser` ADD COLUMN `iban` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Product` MODIFY `price` DECIMAL(19, 4) NOT NULL;

-- AlterTable
ALTER TABLE `Settings` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `Streeplijst` DROP COLUMN `date`,
    DROP COLUMN `isActive`,
    DROP COLUMN `personId`,
    ADD COLUMN `endDate` DATETIME(3) NULL,
    ADD COLUMN `notes` VARCHAR(191) NULL,
    ADD COLUMN `startDate` DATETIME(3) NULL,
    ADD COLUMN `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Transaction` DROP COLUMN `description`,
    DROP COLUMN `fromId`,
    DROP COLUMN `ledgerId`,
    DROP COLUMN `price`,
    DROP COLUMN `toId`,
    ADD COLUMN `type` ENUM('SALDO', 'BANK') NOT NULL DEFAULT 'SALDO',
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- DropTable
DROP TABLE `Acquisition`;

-- DropTable
DROP TABLE `Declaration`;

-- DropTable
DROP TABLE `Sale`;

-- CreateTable
CREATE TABLE `TransactionMatchRow` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NULL,
    `amount` DECIMAL(19, 4) NOT NULL,
    `transactionId` INTEGER NOT NULL,
    `saldoTransactionId` INTEGER NULL,
    `journalId` INTEGER NULL,

    UNIQUE INDEX `TransactionMatchRow_saldoTransactionId_key`(`saldoTransactionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SaldoTransaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NOT NULL,
    `price` DECIMAL(19, 4) NOT NULL,
    `fromId` INTEGER NOT NULL,
    `toId` INTEGER NOT NULL,
    `transactionId` INTEGER NOT NULL,

    UNIQUE INDEX `SaldoTransaction_transactionId_key`(`transactionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BankTransaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ref` VARCHAR(191) NULL,
    `type` ENUM('TOPUP', 'TRANSFER', 'CARD_PAYMENT') NOT NULL,
    `product` ENUM('Savings', 'Current') NOT NULL,
    `startedDate` DATETIME(3) NOT NULL,
    `completedDate` DATETIME(3) NULL,
    `description` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(19, 4) NOT NULL,
    `fee` DECIMAL(19, 4) NOT NULL,
    `relationId` INTEGER NULL,
    `transactionId` INTEGER NOT NULL,

    UNIQUE INDEX `BankTransaction_transactionId_key`(`transactionId`),
    UNIQUE INDEX `BankTransaction_type_product_startedDate_completedDate_descr_key`(`type`, `product`, `startedDate`, `completedDate`, `description`, `amount`, `fee`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Journal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ref` VARCHAR(191) NULL,
    `date` DATE NULL,
    `termsOfPayment` INTEGER NOT NULL,
    `tav` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `type` ENUM('SALE', 'PURCHASE', 'DECLARATION') NOT NULL,
    `relationId` INTEGER NOT NULL,
    `treasurerId` INTEGER NULL,
    `streeplijstId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeclarationData` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `methodOfPayment` VARCHAR(191) NOT NULL DEFAULT 'Eigen rekening',
    `receiveMethod` ENUM('SALDO', 'ACCOUNT') NOT NULL DEFAULT 'SALDO',
    `status` ENUM('ACCEPTED', 'DECLINED', 'PENDING') NOT NULL DEFAULT 'PENDING',
    `iban` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `askedAmount` DECIMAL(19, 4) NOT NULL,
    `reason` VARCHAR(191) NOT NULL,
    `financialPersonId` INTEGER NOT NULL,
    `journalId` INTEGER NULL,

    UNIQUE INDEX `DeclarationData_journalId_key`(`journalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JournalRow` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `amount` INTEGER NOT NULL,
    `price` DECIMAL(19, 4) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `productId` INTEGER NULL,
    `ledgerId` INTEGER NOT NULL,
    `journalId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JournalAttachments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `MIMEtype` VARCHAR(191) NOT NULL,
    `filename` VARCHAR(191) NOT NULL,
    `size` INTEGER NOT NULL,
    `journalId` INTEGER NULL,

    UNIQUE INDEX `JournalAttachments_filename_key`(`filename`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FinancialPersonDataOther` ADD CONSTRAINT `FinancialPersonDataOther_personId_fkey` FOREIGN KEY (`personId`) REFERENCES `FinancialPerson`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TransactionMatchRow` ADD CONSTRAINT `TransactionMatchRow_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `Transaction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TransactionMatchRow` ADD CONSTRAINT `TransactionMatchRow_saldoTransactionId_fkey` FOREIGN KEY (`saldoTransactionId`) REFERENCES `SaldoTransaction`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TransactionMatchRow` ADD CONSTRAINT `TransactionMatchRow_journalId_fkey` FOREIGN KEY (`journalId`) REFERENCES `Journal`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaldoTransaction` ADD CONSTRAINT `SaldoTransaction_fromId_fkey` FOREIGN KEY (`fromId`) REFERENCES `FinancialPerson`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaldoTransaction` ADD CONSTRAINT `SaldoTransaction_toId_fkey` FOREIGN KEY (`toId`) REFERENCES `FinancialPerson`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaldoTransaction` ADD CONSTRAINT `SaldoTransaction_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `Transaction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BankTransaction` ADD CONSTRAINT `BankTransaction_relationId_fkey` FOREIGN KEY (`relationId`) REFERENCES `FinancialPerson`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BankTransaction` ADD CONSTRAINT `BankTransaction_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `Transaction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Streeplijst` ADD CONSTRAINT `Streeplijst_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Journal` ADD CONSTRAINT `Journal_relationId_fkey` FOREIGN KEY (`relationId`) REFERENCES `FinancialPerson`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Journal` ADD CONSTRAINT `Journal_treasurerId_fkey` FOREIGN KEY (`treasurerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Journal` ADD CONSTRAINT `Journal_streeplijstId_fkey` FOREIGN KEY (`streeplijstId`) REFERENCES `Streeplijst`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DeclarationData` ADD CONSTRAINT `DeclarationData_financialPersonId_fkey` FOREIGN KEY (`financialPersonId`) REFERENCES `FinancialPerson`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DeclarationData` ADD CONSTRAINT `DeclarationData_journalId_fkey` FOREIGN KEY (`journalId`) REFERENCES `Journal`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JournalRow` ADD CONSTRAINT `JournalRow_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JournalRow` ADD CONSTRAINT `JournalRow_ledgerId_fkey` FOREIGN KEY (`ledgerId`) REFERENCES `Ledger`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JournalRow` ADD CONSTRAINT `JournalRow_journalId_fkey` FOREIGN KEY (`journalId`) REFERENCES `Journal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JournalAttachments` ADD CONSTRAINT `JournalAttachments_journalId_fkey` FOREIGN KEY (`journalId`) REFERENCES `Journal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

INSERT IGNORE INTO `Settings` (`name`, `description`, `value`)
VALUES ('DEFAULT_DECLARATION_LEDGER', 'Standaaard grootboek voor declaraties', '3100'),
('DEFAULT_SALE_BEER_LEDGER', 'Standaard grootboek voor bier verkoop', '4501'),
('DEFAULT_SALE_FOOD_LEDGER', 'Standaard grootboek voor eten verkoop', '4502'),
('DEFAULT_SALE_OTHER_LEDGER', 'Standaard grootboek voor andere verkoop', '4503');