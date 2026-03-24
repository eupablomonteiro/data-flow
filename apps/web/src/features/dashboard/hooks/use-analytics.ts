import { useQuery } from "@tanstack/react-query";
import { getAnalytics } from "@/services/analytics/get-analytics";
import { AnalyticsResponseDTO } from "@dataflow/types";

export function useAnalytics() {
  return useQuery<AnalyticsResponseDTO>({
    queryKey: ["analytics"],
    queryFn: getAnalytics,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
}
