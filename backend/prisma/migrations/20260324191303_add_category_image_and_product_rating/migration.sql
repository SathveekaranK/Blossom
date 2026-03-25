-- AlterTable
ALTER TABLE `category` ADD COLUMN `imageUrl` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `rating` DOUBLE NOT NULL DEFAULT 0.0;
