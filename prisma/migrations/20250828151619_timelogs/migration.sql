/*
  Warnings:

  - You are about to drop the column `hours` on the `TimeLog` table. All the data in the column will be lost.
  - Added the required column `description` to the `TimeLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `TimeLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `TimeLog` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."TimerStatus" AS ENUM ('RUNNING', 'STOPPED', 'PAUSED');

-- AlterTable
ALTER TABLE "public"."TimeLog" DROP COLUMN "hours",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "durationSec" INTEGER,
ADD COLUMN     "endTime" TIMESTAMP(3),
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" "public"."TimerStatus" NOT NULL DEFAULT 'RUNNING',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
