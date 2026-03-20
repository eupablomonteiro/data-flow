export type UploadResponseDTO = {
  id: string;
  filename: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

  progress: {
    totalRows?: number | null;
    processedRows?: number | null;
    successRows?: number | null;
    errorRows?: number | null;
    percentage?: number | null;
  };

  processedAt?: string | null;
  createdAt: string;
};

export type CreateUploadResponseDTO = {
  uploadId: string;
  jobId: string;
};
