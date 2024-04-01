/*
  Warnings:

  - You are about to drop the column `lastNames` on the `users` table. All the data in the column will be lost.
  - Added the required column `test` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "lastNames",
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "test" BOOLEAN NOT NULL;
