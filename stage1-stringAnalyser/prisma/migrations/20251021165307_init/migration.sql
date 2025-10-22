/*
  Warnings:

  - The primary key for the `StringAnalysis` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "StringAnalysis" DROP CONSTRAINT "StringAnalysis_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "StringAnalysis_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "StringAnalysis_id_seq";
