/*
  Warnings:

  - The primary key for the `StringAnalysis` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `StringAnalysis` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "StringAnalysis" DROP CONSTRAINT "StringAnalysis_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "StringAnalysis_pkey" PRIMARY KEY ("id");
