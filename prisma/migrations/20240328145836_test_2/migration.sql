/*
  Warnings:

  - You are about to drop the column `lastName` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "lastName",
ADD COLUMN     "lastNames" TEXT;
