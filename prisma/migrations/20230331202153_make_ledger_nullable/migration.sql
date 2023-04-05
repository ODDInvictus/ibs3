-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_ledgerId_fkey`;

-- AlterTable
ALTER TABLE `Transaction` MODIFY `ledgerId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_ledgerId_fkey` FOREIGN KEY (`ledgerId`) REFERENCES `Ledger`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
