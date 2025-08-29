/*
  Warnings:

  - You are about to drop the column `estimatedSec` on the `Task` table. All the data in the column will be lost.
  - Added the required column `estimatedHours` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Task" DROP COLUMN "estimatedSec",
ADD COLUMN     "estimatedHours" DOUBLE PRECISION NOT NULL;
