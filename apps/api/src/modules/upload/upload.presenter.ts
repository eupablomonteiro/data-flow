import { Upload } from "@dataflow/database";
import { UploadDTO } from "./upload.dto";

export class UploadPresenter {
  static toHTTP(upload: Upload): UploadDTO {
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
      processedAt: upload.processedAt,
      createdAt: upload.createdAt,
    };
  }

  static toHTTPList(uploads: Upload[]): UploadDTO[] {
    return uploads.map((upload) => this.toHTTP(upload));
  }
}
