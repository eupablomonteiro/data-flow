import { Upload } from "@dataflow/database";
import type { UploadResponseDTO } from "@dataflow/types";

export class UploadPresenter {
  static toHTTP(upload: Upload): UploadResponseDTO {
    const percentage =
      upload.totalRows && upload.processedRows
        ? Math.round((upload.processedRows / upload.totalRows) * 100)
        : null;

    return {
      id: upload.id,
      filename: upload.filename,
      status: upload.status,
      progress: {
        totalRows: upload.totalRows,
        processedRows: upload.processedRows,
        successRows: upload.successRows,
        errorRows: upload.errorRows,
        percentage,
      },
      processedAt: upload.processedAt?.toISOString(),
      createdAt: upload.createdAt.toISOString(),
    };
  }

  static toHTTPList(uploads: Upload[]): UploadResponseDTO[] {
    return uploads.map((upload) => this.toHTTP(upload));
  }
}
