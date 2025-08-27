/*
  Warnings:

  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `temp` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'USER');

-- DropForeignKey
ALTER TABLE "public"."ProjectAssignment" DROP CONSTRAINT "ProjectAssignment_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProjectAssignment" DROP CONSTRAINT "ProjectAssignment_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Project" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "role",
ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "public"."temp";

-- AddForeignKey
ALTER TABLE "public"."ProjectAssignment" ADD CONSTRAINT "ProjectAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProjectAssignment" ADD CONSTRAINT "ProjectAssignment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
