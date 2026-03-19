import { api } from "@/lib/api/client";

export async function getUpload(id: string) {
  const response = await api.get(`/uploads/${id}`);
  return response.data;
}
