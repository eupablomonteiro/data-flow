import { getPrisma, UploadStatus } from "@dataflow/database";

export class UploadRepository {
  async updateStatus(id: string, status: UploadStatus) {
    await getPrisma().upload.update({
      where: { id },
      data: { status },
    });
  }

  async markCompleted(id: string) {
    await getPrisma().upload.update({
      where: { id },
      data: { status: UploadStatus.COMPLETED },
    });
  }

  async markFailed(id: string) {
    await getPrisma().upload.update({
      where: { id },
      data: { status: UploadStatus.FAILED },
    });
  }

  async updateMetrics(
    id: string,
    data: {
      totalRows?: number;
      processedRows?: number;
      successRows?: number;
      errorRows?: number;
    },
  ) {
    await getPrisma().upload.update({
      where: { id },
      data,
    });
  }

  async setStartedAt(id: string) {
    await getPrisma().upload.update({
      where: { id },
      data: { startedAt: new Date() },
    });
  }
}
