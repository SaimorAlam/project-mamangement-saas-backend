/*
  Warnings:

  - The `progress` column on the `InfrastructureNode` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `computedProgress` column on the `InfrastructureNode` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `sheetId` on the `Submitted` table. All the data in the column will be lost.
  - You are about to drop the column `submiteCells` on the `Submitted` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."InfrastructureNode" ADD COLUMN     "numericProgress" DOUBLE PRECISION NOT NULL DEFAULT 0,
DROP COLUMN "progress",
ADD COLUMN     "progress" JSONB,
DROP COLUMN "computedProgress",
ADD COLUMN     "computedProgress" JSONB NOT NULL DEFAULT '[]';

-- AlterTable
ALTER TABLE "public"."Submitted" DROP COLUMN "sheetId",
DROP COLUMN "submiteCells";

-- CreateTable
CREATE TABLE "public"."SubmittedElement" (
    "id" TEXT NOT NULL,
    "chartId" TEXT NOT NULL,
    "xAxis" JSONB,
    "yAxis" JSONB,
    "zAxis" JSONB,
    "submittedId" TEXT NOT NULL,

    CONSTRAINT "SubmittedElement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."SubmittedElement" ADD CONSTRAINT "SubmittedElement_chartId_fkey" FOREIGN KEY ("chartId") REFERENCES "public"."ChartTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubmittedElement" ADD CONSTRAINT "SubmittedElement_submittedId_fkey" FOREIGN KEY ("submittedId") REFERENCES "public"."Submitted"("id") ON DELETE CASCADE ON UPDATE CASCADE;
