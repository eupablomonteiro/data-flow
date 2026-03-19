import { api } from "@/lib/api/client";

export async function createUpload(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/uploads", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}
