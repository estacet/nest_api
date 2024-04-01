/*
  Warnings:

  - You are about to drop the column `firstNam` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" RENAME COLUMN "firstNam" TO "firstName";
