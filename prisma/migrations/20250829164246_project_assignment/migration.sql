/*
  Warnings:

  - You are about to drop the `_ProjectManagement` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_ProjectManagement" DROP CONSTRAINT "_ProjectManagement_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ProjectManagement" DROP CONSTRAINT "_ProjectManagement_B_fkey";

-- DropTable
DROP TABLE "public"."_ProjectManagement";

-- CreateTable
CREATE TABLE "public"."ProjectManagement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectManagement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ProjectManagement" ADD CONSTRAINT "ProjectManagement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProjectManagement" ADD CONSTRAINT "ProjectManagement_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
