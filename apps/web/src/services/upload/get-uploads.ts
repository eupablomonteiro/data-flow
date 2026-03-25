import { api } from "@/lib/api/client";
import { UploadResponseDTO } from "@dataflow/types";

export async function getUploads(): Promise<UploadResponseDTO[]> {
  const response = await api.get("/uploads", {
    withCredentials: true,
  });
  return response.data;
}
