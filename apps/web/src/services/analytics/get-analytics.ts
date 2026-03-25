import { api } from "@/lib/api/client";
import { AnalyticsResponseDTO } from "@dataflow/types";

export async function getAnalytics(): Promise<AnalyticsResponseDTO> {
  const response = await api.get("/analytics", {
    withCredentials: true,
  });
  return response.data;
}
