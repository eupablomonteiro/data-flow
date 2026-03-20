"use client";

import { useState } from "react";
import { useUpload } from "@/features/upload/hooks/use-upload";
import { createUpload } from "@/services/upload/create-upload";

export default function Page() {
  const [uploadId, setUploadId] = useState<string | null>(null);

  const { data, isLoading } = useUpload(uploadId ?? "");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0]) return;

    const response = await createUpload(e.target.files[0]);
    setUploadId(response.uploadId);
  }

  const percentage = data?.progress.percentage ?? 0;

  return (
    <div className="p-6">
      <input type="file" onChange={handleUpload} />

      {isLoading && <p>Carregando...</p>}

      {data && (
        <div className="w-36 h-36 mt-4 bg-amber-400">
          <p>ID: {data.id}</p>
          <p>Status: {data.status}</p>
          <p>Progresso: {percentage}</p>
        </div>
      )}
    </div>
  );
}
