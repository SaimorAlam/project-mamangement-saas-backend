-- AlterTable
ALTER TABLE "public"."Widget" ADD COLUMN     "splineChartId" TEXT;

-- CreateTable
CREATE TABLE "public"."SplineChart" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFiledDataset" INTEGER NOT NULL,
    "lastFiledDAtaset" INTEGER NOT NULL,
    "filter_By" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ChartTableId" TEXT NOT NULL,

    CONSTRAINT "SplineChart_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SplineChart_ChartTableId_key" ON "public"."SplineChart"("ChartTableId");

-- AddForeignKey
ALTER TABLE "public"."SplineChart" ADD CONSTRAINT "SplineChart_ChartTableId_fkey" FOREIGN KEY ("ChartTableId") REFERENCES "public"."ChartTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Widget" ADD CONSTRAINT "Widget_splineChartId_fkey" FOREIGN KEY ("splineChartId") REFERENCES "public"."SplineChart"("id") ON DELETE SET NULL ON UPDATE CASCADE;
