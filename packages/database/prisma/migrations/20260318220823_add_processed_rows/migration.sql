-- AlterTable
ALTER TABLE "Upload" ADD COLUMN     "errorRows" INTEGER,
ADD COLUMN     "processedRows" INTEGER,
ADD COLUMN     "startedAt" TIMESTAMP(3),
ADD COLUMN     "successRows" INTEGER,
ADD COLUMN     "totalRows" INTEGER;
