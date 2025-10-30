/*
  Warnings:

  - The primary key for the `BoardCollaborator` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `BoardCollaborator` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `BoardCollaborator` DROP FOREIGN KEY `BoardCollaborator_boardId_fkey`;

-- DropIndex
DROP INDEX `BoardCollaborator_boardId_userId_key` ON `BoardCollaborator`;

-- AlterTable
ALTER TABLE `BoardCollaborator` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`boardId`, `userId`);

-- AddForeignKey
ALTER TABLE `BoardCollaborator` ADD CONSTRAINT `BoardCollaborator_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `Board`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
