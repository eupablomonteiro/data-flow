import { useQuery } from "@tanstack/react-query";
import { getUpload } from "@/services/upload/get-upload";

export function useUpload(id: string) {
  return useQuery({
    queryKey: ["upload", id],
    queryFn: () => getUpload(id),
    enabled: !!id,
    refetchInterval: 2000,
  });
}
