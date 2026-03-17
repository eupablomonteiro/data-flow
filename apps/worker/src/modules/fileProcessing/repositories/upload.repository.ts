import { prisma, UploadStatus } from "@dataflow/database";

export class UploadRepository {
  async updateStatus(id: string, status: UploadStatus) {
    await prisma.upload.update({
      where: { id },
      data: { status },
    });
  }

  async markCompleted(id: string) {
    await prisma.upload.update({
      where: { id },
      data: { status: UploadStatus.COMPLETED, processedAt: new Date() },
    });
  }

  async markFailed(id: string) {
    await prisma.upload.update({
      where: { id },
      data: { status: UploadStatus.FAILED, processedAt: new Date() },
    });
  }
}
