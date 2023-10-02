-- AlterTable
ALTER TABLE `FinancialPerson` ADD COLUMN `iban` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `FinancialPersonDataOther` ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `email` VARCHAR(191) NULL,
    MODIFY `description` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Settings` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- CreateTable
CREATE TABLE `SaleInvoice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATE NOT NULL,
    `termsOfPayment` INTEGER NOT NULL,
    `sent` BOOLEAN NOT NULL DEFAULT false,
    `toId` INTEGER NOT NULL,
    `treasurerId` INTEGER NULL,
    `bankTransactionId` INTEGER NULL,

    UNIQUE INDEX `SaleInvoice_bankTransactionId_key`(`bankTransactionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SaleInvoiceRow` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `amount` INTEGER NOT NULL,
    `price` DECIMAL(19, 4) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `productId` INTEGER NULL,
    `ledgerId` INTEGER NOT NULL,
    `saleInvoiceId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BankTransaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Amount` DECIMAL(19, 4) NOT NULL,
    `startedDate` DATETIME(3) NOT NULL,
    `completedDate` DATETIME(3) NULL,
    `fee` DECIMAL(19, 4) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `type` ENUM('TOPUP', 'TRANSFER', 'CARD_PAYMENT') NOT NULL,
    `product` ENUM('SAVINGS', 'CURRENT') NOT NULL,
    `fromId` INTEGER NULL,
    `toId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SaleInvoice` ADD CONSTRAINT `SaleInvoice_toId_fkey` FOREIGN KEY (`toId`) REFERENCES `FinancialPerson`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaleInvoice` ADD CONSTRAINT `SaleInvoice_treasurerId_fkey` FOREIGN KEY (`treasurerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaleInvoice` ADD CONSTRAINT `SaleInvoice_bankTransactionId_fkey` FOREIGN KEY (`bankTransactionId`) REFERENCES `BankTransaction`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaleInvoiceRow` ADD CONSTRAINT `SaleInvoiceRow_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaleInvoiceRow` ADD CONSTRAINT `SaleInvoiceRow_ledgerId_fkey` FOREIGN KEY (`ledgerId`) REFERENCES `Ledger`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaleInvoiceRow` ADD CONSTRAINT `SaleInvoiceRow_saleInvoiceId_fkey` FOREIGN KEY (`saleInvoiceId`) REFERENCES `SaleInvoice`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BankTransaction` ADD CONSTRAINT `BankTransaction_fromId_fkey` FOREIGN KEY (`fromId`) REFERENCES `FinancialPerson`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BankTransaction` ADD CONSTRAINT `BankTransaction_toId_fkey` FOREIGN KEY (`toId`) REFERENCES `FinancialPerson`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
