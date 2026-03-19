export interface UploadDTO {
  id: string;
  filename: string;
  status: string;
  progress: {
    totalRows?: number | null;
    processedRows?: number | null;
    successRows?: number | null;
    errorRows?: number | null;
    percentage?: number | null;
  };
  processedAt?: Date | null;
  createdAt: Date;
}
