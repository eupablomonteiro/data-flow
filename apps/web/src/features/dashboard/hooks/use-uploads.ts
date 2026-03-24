import { useQuery } from "@tanstack/react-query";
import { getUploads } from "@/services/upload/get-uploads";
import { UploadResponseDTO } from "@dataflow/types";

export function useUploads() {
  return useQuery<UploadResponseDTO[]>({
    queryKey: ["uploads"],
    queryFn: getUploads,
    staleTime: 1000 * 10,
  });
}
