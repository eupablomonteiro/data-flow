-- AlterTable: Add userId to Upload table
-- Note: If you have existing upload records without a userId, delete them first or assign a userId manually.

ALTER TABLE "Upload" ADD COLUMN "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Upload_userId_idx" ON "Upload"("userId");

-- AddForeignKey
ALTER TABLE "Upload" ADD CONSTRAINT "Upload_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
