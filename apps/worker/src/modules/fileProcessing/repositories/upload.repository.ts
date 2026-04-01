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
      data: {
        status: UploadStatus.COMPLETED,
        processedAt: new Date(),
      },
    });
  }

  async markFailed(
    id: string,
    metrics: {
      totalRows: number;
      processedRows: number;
      successRows: number;
      errorRows: number;
      errors?: Array<{ row: number; errors: string[] }>;
    },
  ) {
    await getPrisma().upload.update({
      where: { id },
      data: {
        status: UploadStatus.FAILED,
        processedAt: new Date(),
        totalRows: metrics.totalRows,
        processedRows: metrics.processedRows,
        successRows: metrics.successRows,
        errorRows: metrics.errorRows,
        errors: metrics.errors ?? [],
      },
    });
  }

  async markPartial(
    id: string,
    metrics: {
      totalRows: number;
      processedRows: number;
      successRows: number;
      errorRows: number;
      errors?: Array<{ row: number; errors: string[] }>;
    },
  ) {
    await getPrisma().upload.update({
      where: { id },
      data: {
        status: UploadStatus.PARTIAL,
        processedAt: new Date(),
        totalRows: metrics.totalRows,
        processedRows: metrics.processedRows,
        successRows: metrics.successRows,
        errorRows: metrics.errorRows,
        errors: metrics.errors ?? [],
      },
    });
  }

  async addErrors(
    id: string,
    errors: Array<{ row: number; errors: string[] }>,
  ) {
    await getPrisma().upload.update({
      where: { id },
      data: { errors },
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
