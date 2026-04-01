import { api } from "@/lib/api/client";
import { UploadErrorsResponseDTO } from "@dataflow/types";

export async function getUploadErrors(id: string): Promise<UploadErrorsResponseDTO> {
  const response = await api.get(`/uploads/${id}/errors`);
  return response.data;
}
