import { useQuery } from "@tanstack/react-query";
import { getUpload } from "@/services/upload/get-upload";
import { UploadResponseDTO } from "@dataflow/types";

export function useUpload(id: string) {
  return useQuery<UploadResponseDTO>({
    queryKey: ["upload", id],
    queryFn: () => getUpload(id),
    enabled: !!id,
    refetchInterval: (query) => {
      const data = query.state.data;

      if (!data) return 2000;

      const isFinished =
        data.status === "COMPLETED" || data.status === "FAILED";

      return isFinished ? false : 2000;
    },
  });
}
