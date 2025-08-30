-- CreateEnum
CREATE TYPE "public"."ProjectStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED');

-- AlterTable
ALTER TABLE "public"."Project" ADD COLUMN     "color" TEXT NOT NULL DEFAULT '#12499B',
ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "public"."ProjectStatus" NOT NULL DEFAULT 'OPEN',
ADD COLUMN     "timeFrameEnd" TIMESTAMP(3),
ADD COLUMN     "timeFrameStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
